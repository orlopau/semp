**Retrieves all planning requests**
----
Retrieves all planning requests for device.

* **URL**

    /api/devices/:id/planningRequests

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** 
    
    ```
        {
            [
                {
                    DeviceId: string,
                    EarliestStart: number,
                    LatestEnd: number,
                    MaxRunningTime: number,
                    MinRunningTime: number
                }, ...
            ]
        }
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

* **Notes:**

    Returns empty list when no planning requests are registered.