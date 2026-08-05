import sys
import os

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.hybrid_network import HybridNetwork

network = HybridNetwork()

model = network.build(1285)

model.summary()