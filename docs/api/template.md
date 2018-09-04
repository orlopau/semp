**Title**
----
  <_Additional information about your API call. Try to use verbs that match both request type (fetching vs modifying) and plurality (one vs multiple)._>

* **URL**

* **Method:**
  
  `GET` | `POST` | `DELETE` | `PUT`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

   **Optional:**
 
   `photo_id=[alphanumeric]`

* **Data Params**

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`
 
* **Error Response:**

  * **Code:** 401 UNAUTHORIZED

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY

* **Sample Call:**

* **Notes:**