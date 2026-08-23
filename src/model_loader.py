"""
model_loader.py
---------------
Compatibility shim for loading .keras model files saved with Keras >= 3.15
on an environment running Keras 3.12.

Keras 3.15 added a ``quantization_config`` keyword argument to Dense layers.
When those models are loaded on Keras 3.12 the deserializer raises:

    ValueError: Unrecognized keyword arguments passed to Dense: {'quantization_config': None}

Keras 3's deserializer resolves layer classes by their registered module path
(``keras.layers.Dense``), so passing a subclass via ``custom_objects`` does
not intercept the call.  The reliable fix is to temporarily monkey-patch the
original ``Dense.__init__`` to silently discard the unknown kwarg.
"""

from contextlib import contextmanager
from tensorflow.keras.models import load_model
import tensorflow.keras.layers as _kl


@contextmanager
def _compat_dense_ctx():
    """Context manager that patches Dense.__init__ to drop unknown kwargs."""
    original_init = _kl.Dense.__init__

    def _patched_init(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        original_init(self, *args, **kwargs)

    _kl.Dense.__init__ = _patched_init
    try:
        yield
    finally:
        _kl.Dense.__init__ = original_init


def load_keras_model(model_path: str, compile: bool = False):
    """Load a .keras model file with backward-compatible Dense deserialization.

    Parameters
    ----------
    model_path:
        Path to the ``.keras`` file.
    compile:
        Whether to recompile the model after loading.  Defaults to ``False``
        because the saved compile config may also reference unknown objects.

    Returns
    -------
    keras.Model
    """
    with _compat_dense_ctx():
        return load_model(model_path, compile=compile)
