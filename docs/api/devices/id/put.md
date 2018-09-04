**Registers a new device**
----
Registers a new device on the gateway with given parameters.

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
               deviceId: string,
               name: string,
               type: string,
               measurementMethod: string,
               interruptionsAllowed: boolean,
               maxPower: number,
               emSignalsAccepted: boolean,
               status: string,
               vendor: string,
               serialNr: string,
               absoluteTimestamps: boolean,
               optionalEnergy: boolean,
               minOnTime?: number,
               minOffTime?: number,
               url?: string
           }
       }  
     ``` 

* **Success Response:**
  
  * **Code:** 200
 
* **Error Response:**

  * **Code:** 404 NOT FOUND

  OR

  * **Code:** 400 BAD REQUEST