"""DP-GUI Python package."""
import logging

from .dargs import generate_input_json as generate_dpgui_templates
from .web import run as start_dpgui

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

__all__ = ["start_dpgui", "generate_dpgui_templates"]
