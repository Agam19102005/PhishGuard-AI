import os
import numpy as np
import onnxruntime as ort


MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "models",
    "model.onnx"
)


class PhishingDetector:

    def __init__(self):
        print("Loading phishing detection model...")

        self.session = ort.InferenceSession(
            MODEL_PATH,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name

        print("Model loaded successfully!")
        print("Input:", self.input_name)

    def predict(self, url: str):

        # ONNX model expects an array of strings
        inputs = np.array([url], dtype=str)

        results = self.session.run(
            None,
            {self.input_name: inputs}
        )

        label = int(results[0][0])

        probabilities = results[1][0]

        phishing_probability = float(probabilities[1])
        legitimate_probability = float(probabilities[0])

        if label == 1:
            prediction = "PHISHING"
        else:
            prediction = "LEGITIMATE"

        if phishing_probability >= 0.80:
            risk = "HIGH"
        elif phishing_probability >= 0.50:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        return {
            "url": url,
            "prediction": prediction,
            "phishing_probability": round(
                phishing_probability * 100, 2
            ),
            "legitimate_probability": round(
                legitimate_probability * 100, 2
            ),
            "risk": risk
        }


if __name__ == "__main__":

    detector = PhishingDetector()

    test_urls = [
        "https://google.com",
        "https://github.com",
        "https://www.microsoft.com"
    ]

    for url in test_urls:

        result = detector.predict(url)

        print("\n" + "=" * 60)
        print("URL:", result["url"])
        print("Prediction:", result["prediction"])
        print(
            "Phishing Probability:",
            result["phishing_probability"],
            "%"
        )
        print(
            "Legitimate Probability:",
            result["legitimate_probability"],
            "%"
        )
        print("Risk:", result["risk"])