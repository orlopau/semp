**Sets last power consumption**
----
Replaces or "creates" last power consumption for device.

* **URL**

    /api/devices/:id/lastPower

* **Method:**
  
  `PUT`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

    ```
    {
        power: {
            Watts: number,
            MinPower?: number,
            MaxPower?: number
        }
    }
    ```

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND
  
  OR
  
  * **Code:** 400 BAD REQUEST
