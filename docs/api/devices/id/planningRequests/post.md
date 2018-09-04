**Adds a new planning request**
----
Adds a new planning request to a device.

* **URL**

    /api/devices/:id/planningRequests

* **Method:**
  
  `POST`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

    ```
        {
            planning: {
            EarliestStart: number,
            LatestEnd: number,
            MinRunningTime: number,
            MaxRunningTime: number
            }            
        }
    ```

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

* **Notes:**

    Timestamps are in seconds, absolute or relative depending on what you set for the device.