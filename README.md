# Website Backend
The Official UTD Girls Who Code website backend!

This is a Express.JS backend that uses Mongoose to interact with a MongoDB Atlas cluster.

## Api
### Events
#### Model
```json
{
    "title": "String",
    "description": "String",
    "date": "DateString",
    "flyerUrl": "ShortenedURLString"
},
```
#### Controller
|Command  |Method   |Route          |Description|
|---------|---------|---------------|-----------|
|Create   |POST     |/api/events |Create a new Event|
|FindAll  |GET      |/api/events?title=<regex_string>|Get all the Events in the database. Optionally, you can include a title as query param to filter events by title|
|FindOne  |GET      |/api/events/:id|Get a singular Event by id|
|Update   |PUT      |/api/events/:id|Update a singular Event by id|
|Delete   |DELETE   |/api/events/:id|Delete a singular Event by id|

### Officers
#### Model
```json
{
    "name": "String",
    "position": "String",
    "bio": "String",
    "profilePhotoUrl": "ShortenedURLString",
    "externalLinks": {
      "Key": "Value",
      "GITHUB": "https://github.com/utd-gwc"
    },
},
```

#### Controller
|Command  |Method   |Route          |Description|
|---------|---------|---------------|-----------|
|Create   |POST     |/api/officers|Create a new Officer|
|FindAll  |GET      |/api/officers?name=<regex_string>|Get all the Officers in the database. Optionally, include a name as a query param to filter officers by name|
|FindOne  |GET      |/api/officers/:id|Get a singular Officer by id|
|Update   |PUT      |/api/officers/:id|Update an Officer by id|
|Delete   |DELETE   |/api/officers/:id|Delete an Officer by id|


