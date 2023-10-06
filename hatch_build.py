"""Hatch build hook for dpgui."""
import os
import subprocess
from pathlib import Path
from shutil import copytree, rmtree
from typing import Any

import yaml
from hatchling.builders.hooks.plugin.interface import BuildHookInterface


def node_call(args, **kwargs):
    """Call node with subprocess."""
    return subprocess.call(["node", *args], **kwargs)


class CustomBuildHook(BuildHookInterface):
    """Custom build hook for dpgui."""

    PLUGIN_NAME = "build_node"

    def initialize(self, version: str, build_data: dict[str, Any]) -> None:
        """Build the web app and copy to Python directory."""
        project_dir = Path(self.root)

        with open(project_dir / ".yarnrc.yml") as f:
            yarn_path = str(Path(yaml.load(f, Loader=yaml.Loader)["yarnPath"]))

        node_call([yarn_path], cwd=project_dir)
        node_call(
            [yarn_path, "build"],
            cwd=project_dir,
            env={
                **os.environ,
                "BASE_URL": "/",
                "VUE_APP_DPGUI_PYTHON": "1",
                "UV_USE_IO_URING": "0",
            },
        )

        bundle_html_path = project_dir / "dist"

        if not bundle_html_path.exists():
            raise RuntimeError("Failed to build the project with Yarn, please retry.")

        rmtree(project_dir / "dpgui" / "dist", ignore_errors=True)
        copytree(bundle_html_path, project_dir / "dpgui" / "dist")
