from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import BatchNormalization


class HybridNetwork:

    def build(self, input_dim):

        model = Sequential()

        model.add(Dense(
            512,
            activation="relu",
            input_shape=(input_dim,)
        ))

        model.add(BatchNormalization())

        model.add(Dropout(0.40))

        model.add(Dense(
            256,
            activation="relu"
        ))

        model.add(Dropout(0.30))

        model.add(Dense(
            64,
            activation="relu"
        ))

        model.add(Dense(
            4,
            activation="softmax"
        ))

        return model