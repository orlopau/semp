**Creates new device**
----
Creates a new device

* **URL**

    /api/devices

* **Method:**
  
  `POST`
  
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
  
  * **Code:** 200 <br />

* **Error Response:**

  * **Code:** 404 NOT FOUND

  OR

  * **Code:** 400 BAD REQUEST
  
  OR
  
  * **Code** 405 RESOURCE COULD NOT BE CREATED
    
* **Notes:**

    Returns 405 if device with same ID already exists.