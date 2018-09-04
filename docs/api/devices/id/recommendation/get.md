**Polls recommendation**
----
Polls last recommendation from gateway. Preferred method is registering a hook url.

* **URL**

    /api/devices/:id/recommendation

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ see SMA docs -> EM2Device }`
 
* **Error Response:**

  * **Code:** 404 NOT FOUND