# DP-GUI

A web-based GUI for user inputs.

## For users

### Website

Visit the app from https://deepmodeling.org/dpgui.

### Python package

To have arguments from other installed Python packages, install the DP-GUI Python package:

```sh
pip install dpgui
dpgui
```

## For developers

### Vue app

Install the app using yarn:
```sh
yarn install
```

Preview the app:
```sh
yarn serve
```

Build the app:
```sh
yarn build
```

### Add arguments from other packages to DP-GUI

Add entry points `dpgui` in `pyproject.toml`:

```toml
[project.entry-points."dpgui"]
"DPDispatcher Machine" = "dpdispatcher.arginfo:machine_dargs"
"DPDispatcher Resources" = "dpdispatcher.arginfo:resources_dargs"
"DPDispatcher Task" = "dpdispatcher.arginfo:task_dargs"
```

where the entry points value (such as `machine_dargs`) should be a function that returns `dargs.Argument` or `list[dargs.Argument]`.
