"""Export all installed dargs inputs."""
import json

try:
    from importlib import metadata
except ImportError:  # for Python<3.8
    import importlib_metadata as metadata

from dargs import ArgumentEncoder


def generate_input_json() -> str:
    """Generate JSON string for inputs of installed packages.

    Returns
    -------
    str
        JSON string for inputs of installed packages.
    """
    try:
        eps = metadata.entry_points(group="dpgui")
    except TypeError:
        eps = metadata.entry_points().get("dpgui", [])
    args = {
        ep.name: {
            "name": ep.name,
            "argument": ep.load()(),
        }
        for ep in eps
    }
    return json.dumps(args, cls=ArgumentEncoder, separators=(",", ":"))
