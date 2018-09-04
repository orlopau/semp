**Registers hook for device**
----
Registers or replaces hook url for device. A POST request is then sent to the hook url,
whenever a recommendation by the energy manager is received.

* **URL**

    /api/devices/:id/hook

* **Method:**
  
  `POST`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

    ```
    {hookURL: string}
    ```

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

* **Notes:**

    Only one hook url can be registered.