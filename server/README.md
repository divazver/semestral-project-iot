# SERVER

## uu-wet-app

Unicorn Semestral Project - IoT

---

## Local Dependencies

Version of npm - `8.xx.xx`

Version of node - `16.xx.xx`

## Installation

### Local developing (localhost:4000)

1.  Rename `.env.example` to `.env`
2.  Run `$ npm i`
3.  `$ npm run serve`

## Access

**Local**

- (localhost) -> Port 4000
- Credentials:
  1.  AdminUser: **adminPassword**
  2.  SimpleUser: **userPassword**
- (localhost) -> Port 4000
- MongoDB Compass URI:
  - `mongodb://username:root@localhost:27017/`
- Insomnia / Postman
  - import data from `/server/Collections/`
  - create your own environment with that values :
  ```
  {
	"host": "localhost:4000",
	"jwtToken": "<COPY&PAST token from /login here>",
  "gatewayToken": "<COPY&PAST token from gateway here>"
  }
  ```

---

## Authors

- [Michal Durik](https://github.com/miko866)
- [Peter Brodec]()
- [Martin Řehořek]()
- [Antonín Martykán]()
- [Martin Lefler]()

## Copyright

&copy; The best team ever 
