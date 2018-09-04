**Retrieves a single device**
----
Retrieves all devices that are registered on the gateway.

* **URL**

    /api/devices/:id

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[string]`
  
* **Success Response:**
  
  * **Code:** 200 <br />
    **Data Content:**
    
    ```
       {
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
    ``` 
    
* **Error Response:**

  * **Code:** 404 NOT FOUND

    
* **Notes:**

    Returns an empty list if no devices are registered.