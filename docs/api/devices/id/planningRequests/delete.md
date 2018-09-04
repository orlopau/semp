**Deletes all planning requests**
----
Deletes all planning requests for given device.

* **URL**
    
    /api/devices/:id/planningRequests

* **Method:**
  
  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

* **Notes:**

    If the planning request is deleted, the Energy Manager considers it completed.