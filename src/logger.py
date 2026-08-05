"""
=========================================================
Logger Module
=========================================================
"""

import logging
from pathlib import Path

LOG_FILE = Path("project.log")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("BrainTumor")


def log(message):
    logger.info(message)
    print(message)