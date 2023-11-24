/**
 * @swagger
 * /designer/signup:
 *   post:
 *     summary: Create a new designer account
 *     description: Create a new designer account with provided information.
 *     tags: [designer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the designer.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the designer.
 *               password:
 *                 type: string
 *                 description: The password for the designer account.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the password for the designer account.
 *               description:
 *                 type: string
 *                 description: A description of the designer.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the designer.
 *               image:
 *                 type: string
 *                 description: URL of the designer's image.
 *             example:
 *               name: Badr designer
 *               email: badrnasher@gmail.com
 *               password: Orgy_Pass1
 *               confirmPassword: Orgy_Pass1
 *               description: Example designer description
 *               phoneNumber: 8764567890
 *               image: http://example.com/org_image.jpg
 *     responses:
 *       200:
 *         description: designer account created successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer account created successfully
 *       400:
 *         description: Invalid input or email already in use. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /designer/signin:
 *   post:
 *     summary: Sign in to the designer
 *     tags:
 *       - designer
 *     requestBody:
 *       description: Signin credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *             required:
 *               - emailOrUsername
 *               - password
 *     responses:
 *       '200':
 *         description: Successful signin
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: JWT token
 *       '400':
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /designer/updateAccount:
 *   put:
 *     summary: Update designer account
 *     description: Update the designer account information for the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the designer.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the designer.
 *               description:
 *                 type: string
 *                 description: The updated description of the designer.
 *               image:
 *                 type: string
 *                 description: The updated URL of the designer's image.
 *               phone_number:
 *                 type: string
 *                 description: The updated phone number of the designer.
 *             example:
 *               name: Updated Org Name
 *               email: updated@example.com
 *               description: Updated designer description
 *               image: http://example.com/updated_image.jpg
 *               phone_number: +1234567890
 *     responses:
 *       200:
 *         description: designer account updated successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer account updated successfully
 *       400:
 *         description: Invalid input. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer:
 *   delete:
 *     summary: Delete designer account
 *     description: Delete the designer account for the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: designer account deleted successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer account deleted successfully
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Unauthorized
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: designer not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/{DesignerId}:
 *   get:
 *     summary: Get designer by ID
 *     description: Get designer details by its ID.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: DesignerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the designer to retrieve.
 *     responses:
 *       200:
 *         description: Returns the details of the specified designer.
 *         schema:
 *           $ref: "#/components/schemas/designer"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Unauthorized
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: designer not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Internal Server Error
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/signOut:
 *   post:
 *     summary: Sign out from the designer account
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirects to the API documentation page after signing out
 *       400:
 *         description: Bad request or error while signing out
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [designer]
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               category:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *             example:
 *               title: Gather at bakery
 *               description: be a good person
 *               location: on earth
 *               category: Charity
 *               start_date: 2023-12-10T10:43:57.172Z
 *               end_date: 2024-08-10T10:43:57.172Z
 *               image: http://example.com/org_image.jpg
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 event:
 *                   type: object
 *       400:
 *         description: Bad request or missing fields
 *       404:
 *         description: designer not found
 *       500:
 *         description: Error while creating the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /designer/{DesignerId}/events:
 *   get:
 *     summary: Get designer events
 *     description: Get all events created by the specified designer.
 *     tags: [designer]
 *     parameters:
 *       - in: path
 *         name: DesignerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the designer to retrieve events for.
 *     responses:
 *       200:
 *         description: Returns a list of events created by the specified designer.
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Event"
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: designer not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /designer/events/{eventId}:
 *   put:
 *     summary: Update an event
 *     description: Update an event created by the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/definitions/EventUpdateData"
 *     responses:
 *       200:
 *         description: Event updated successfully. Returns a success message and the updated event in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/definitions/EventResponse"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Event or designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 *
 * definitions:
 *   EventUpdateData:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       start_date:
 *         type: string
 *         format: date
 *       end_date:
 *         type: string
 *         format: date
 *       location:
 *         type: string
 *       category:
 *         type: string
 *       image:
 *         type: string
 *       description:
 *         type: string
 *   EventResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 *       event:
 *         $ref: "#/definitions/Event"
 *   Event:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       start_date:
 *         type: string
 *         format: date
 *       end_date:
 *         type: string
 *         format: date
 *       location:
 *         type: string
 *       category:
 *         type: string
 *       image:
 *         type: string
 *       description:
 *         type: string
 */

/**
 * @swagger
 * /designer/events/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event created by the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to delete.
 *     responses:
 *       200:
 *         description: Event deleted successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Event or designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/{DesignerId}/attending-users:
 *   get:
 *     summary: Get attending users of designer events
 *     description: Get a list of attending users for events organized by the specified designer.
 *     tags: [designer]
 *     parameters:
 *       - in: path
 *         name: DesignerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the designer to retrieve attending users for.
 *     responses:
 *       200:
 *         description: Attending users retrieved successfully. Returns a list of events with their attendees in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   eventName:
 *                     type: string
 *                     description: The name of the event.
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of usernames of attending users.
 *                 example:
 *                   eventName: Event A
 *                   attendees: [User1, User2]
 *       404:
 *         description: designer or events not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /designer/notify-attending-users:
 *   post:
 *     summary: Notify attending users of designer events
 *     description: Send notifications to users attending events organized by the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The notification message to send to attending users.
 *             example:
 *               message: "Join us for an exciting event!"
 *     responses:
 *       200:
 *         description: Notification sent successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 example:
 *                   message: "Notification sent to attending users"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: designer or events not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/{eventId}/notify-event-changes:
 *   post:
 *     summary: Notify attending users about event changes
 *     description: Send notifications to users attending the specified event organized by the authenticated designer.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to send notifications for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The notification message to send about event changes.
 *             example:
 *               message: "Event time has been updated. Check it out!"
 *     responses:
 *       200:
 *         description: Notification sent successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 example:
 *                   message: "Notification sent to attending users about event changes"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Event or designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/events/filter:
 *   get:
 *     summary: Filter designer events
 *     description: Filter and retrieve events created by the authenticated designer based on provided criteria.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter events by category.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter events by location.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events by start date (greater than or equal to).
 *     responses:
 *       200:
 *         description: Filtered events retrieved successfully. Returns an array of events in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Event"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: No matching events found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 example:
 *                   message: "Events not found"
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/events/search:
 *   get:
 *     summary: Search designer events
 *     description: Search and retrieve events created by the authenticated designer based on search query.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query to match against event titles or descriptions.
 *     responses:
 *       200:
 *         description: Matching events retrieved successfully. Returns an array of events in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/Event"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: No matching events found. Returns an empty array in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {}
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/rate/{DesignerId}:
 *   post:
 *     summary: Add a rating and review for an designer
 *     description: Add a rating and review for the specified designer by the authenticated user.
 *     tags: [designer]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: DesignerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the designer to add the rating and review for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: The rating value (between 1 and 5).
 *               review:
 *                 type: string
 *                 description: The review text.
 *             example:
 *               rating: 4
 *               review: "Great designer!"
 *     responses:
 *       200:
 *         description: Rating added successfully. Returns a success message and the updated ratings array in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ratings:
 *                   type: array
 *                   items:
 *                     $ref: "#/definitions/Rating"
 *       400:
 *         description: Invalid rating value. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */

/**
 * @swagger
 * /designer/rating/{DesignerId}:
 *   get:
 *     summary: Get designer ratings
 *     description: Retrieve the ratings for a specific designer.
 *     tags: [designer]
 *     parameters:
 *       - in: path
 *         name: DesignerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the designer to retrieve ratings for.
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully. Returns the average rating and ratings array in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average:
 *                   type: number
 *                   description: The average rating of the designer.
 *                 ratings:
 *                   type: array
 *                   description: Array of rating objects.
 *                   items:
 *                     $ref: '#/definitions/Rating'
 *                     properties:
 *                       user:
 *                         type: string
 *                         description: The username of the user who provided the rating.
 *                       rating:
 *                         type: number
 *                         description: The rating value provided by the user.
 *                       review:
 *                         type: string
 *                         description: The review text provided by the user.
 *               example:
 *                 average: 4.5
 *                 ratings:
 *                   - user: user123
 *                     rating: 5
 *                     review: Excellent designer!
 *                   - user: user456
 *                     rating: 4
 *                     review: Very good work.
 *       404:
 *         description: designer not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Error while getting ratings
 */
