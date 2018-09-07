**Updates a device**
----
Updates device with given parameters.

* **URL**

    /api/devices/:id

* **Method:**
  
  `PUT`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

    ```
       {
           device: {
               name?: string,
               interruptionsAllowed?: boolean,
               maxPower?: number,
               emSignalsAccepted?: boolean,
               status?: string,
               optionalEnergy?: boolean,
               minOnTime?: number,
               minOffTime?: number,
           }
       }  
     ``` 

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

  OR

  * **Code:** 400 BAD REQUEST
