# CSF AI Development Intern Assessment

## Question 1: Processing Video Pipeline

**Assume you have a working ML model that can process individual images and identify carrots, how would you adapt that model such that you could feed it live video inside a grocery store and have it create a record of any carrots it sees?**

### Introduction

Adapting a static image classification model to process a live video feed requires building a pipeline that handles video capture, frame processing, object tracking, and data logging. The goal is to identify unique carrot instances and record their presence, rather than just detecting a carrot in every single frame. Here is a step-by-step breakdown of how such a pipeline would be designed and implemented.

### 1. Video Capture and Frame Extraction

The first step is to access the live video stream from the camera in the grocery store. This can be achieved using a library like **OpenCV**.

-   **Video Source:** OpenCV's `VideoCapture` object can be used to connect to a live camera feed. The source could be a USB camera connected to the system or an IP camera on the store's network.
-   **Frame Rate (FPS):** We need to decide on a suitable frame rate for processing. A higher FPS provides more temporal detail but increases the computational load. A lower FPS (e.g., 5-10 FPS) might be sufficient for tracking objects like carrots on a shelf and would reduce processing requirements. The choice of FPS is a trade-off between real-time performance and tracking accuracy.

### 2. Frame Preprocessing

The carrot detection model was trained on images with specific properties (e.g., size, color format, normalization). Each extracted frame from the video must be preprocessed to match this format before being fed to the model.

-   **Resizing:** The frame should be resized to the input dimensions expected by the model.
-   **Color Space Conversion:** Ensure the frame is in the correct color space (e.g., RGB or BGR, which OpenCV uses by default).
-   **Normalization:** Pixel values should be normalized to the same range the model was trained on (e.g., `[0, 1]` or `[-1, 1]` or standardized).

### 3. Carrot Detection (Inference)

For each preprocessed frame, we will use the provided ML model to detect carrots. The model would likely be an object detection model (like YOLO, SSD, or Faster R-CNN) that outputs bounding boxes for each detected carrot, along with a confidence score.

### 4. Object Tracking

Simply running detection on each frame will produce a new set of bounding boxes every time. This would lead to counting the same carrot multiple times. To avoid this, we need to implement object tracking to identify a carrot as a unique instance across multiple frames.

-   **Assigning IDs:** When a new carrot is detected, it should be assigned a unique ID.
-   **Tracking Algorithms:** We can use a tracking algorithm to follow this carrot in subsequent frames.
    -   **Simple Centroid Tracking:** A simple approach is to calculate the centroid of the bounding boxes. For each new frame, we can associate new detections to existing tracked objects based on the Euclidean distance between their centroids.
    -   **Advanced Trackers:** For more robust tracking, especially in crowded scenes or with camera motion, we could use more advanced algorithms like Kalman Filters, or deep learning-based trackers such as **SORT (Simple Online and Realtime Tracking)** or **DeepSORT**, which are more resilient to occlusions and re-identifying objects after they've been out of frame.

### 5. Creating and Storing Records

The final step is to decide when and how to create a record for a carrot sighting.

-   **Defining a "Sighting":** A new record should be created only when a new, unique carrot is identified by the tracking algorithm. The record can be updated as long as the carrot is being tracked. When a tracked carrot is no longer detected for a certain number of frames (e.g., it's picked up by a customer), we can consider the "sighting" to be complete.

-   **Data to Record:** For each unique carrot sighting, we should store:

    -   `carrot_id`: The unique ID from the tracker.
    -   `first_seen_timestamp`: The timestamp when the carrot was first detected.
    -   `last_seen_timestamp`: The timestamp when the carrot was last seen.
    -   `highest_confidence_score`: The highest detection confidence score recorded for that carrot.
    -   `camera_id` / `location`: Identifier for the camera or its location in the store.
    -   `representative_image_path` (Optional): A path to a saved image of the carrot (e.g., the frame with the highest confidence detection).

-   **Storage:** The records can be stored in various formats depending on the scale and requirements:
    -   **CSV or JSON Log File:** Simple to implement and suitable for a small-scale pilot.
    -   **Database:** For a more robust and scalable solution, a database like **SQLite** (for a self-contained system) or a more powerful database like **PostgreSQL** or a NoSQL database would be better. This allows for easier querying and analysis of the collected data.

### 6. System Architecture and Performance

The overall pipeline can be visualized as follows:

```
Live Video -> Frame Extractor -> Preprocessing Queue -> Model Inference -> Tracking -> Data Logger
```

-   **Real-time Performance:** To ensure the system can keep up with the live feed, especially with a high-resolution video or a slow model, we can use techniques like:
    -   **GPU Acceleration:** Performing model inference on a GPU is crucial for real-time performance.
    -   **Asynchronous Processing:** We can use multi-threading or multi-processing. One thread can be dedicated to video capture, placing frames into a queue. A separate pool of worker threads/processes can then pull frames from this queue, preprocess them, and perform inference. This prevents the video capture from being blocked by slow model inference.

### Conclusion

By creating this pipeline, we can successfully adapt an image-based carrot detection model into a system that monitors a live video feed, intelligently tracks individual carrots, and creates a structured log of each one it observes. The key challenges lie in robust object tracking and ensuring the system performs efficiently in a real-time environment.
