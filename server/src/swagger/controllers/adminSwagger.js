/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Get all users
 *     description: Get a list of all users.
 *     responses:
 *       200:
 *         description: Successfully fetched all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 * /admin/users/{userId}:
 *   get:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Get user by ID
 *     description: Get a user by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: Successfully fetched the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: User not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: User not found
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
 *   put:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Update user by ID
 *     description: Update user details by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The new phone number for the user.
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The new birthday for the user (YYYY-MM-DD).
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *               firstname:
 *                 type: string
 *                 description: The new first name for the user.
 *               lastname:
 *                 type: string
 *                 description: The new last name for the user.
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: The new gender for the user.
 *               avatar:
 *                 type: string
 *                 description: The new avatar URL for the user.
 *             example:
 *               phoneNumber: +1234567890
 *               birthday: 1990-01-01
 *               username: john_doe
 *               firstname: John
 *               lastname: Doe
 *               gender: male
 *               avatar: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User updated successfully
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: User not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: User not found
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
 *   delete:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Delete user by ID
 *     description: Delete a user by their ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: User deleted successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User deleted successfully
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: User not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: User not found
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
 * /admin/Designers:
 *   get:
 *     security:
 *       - cookieAuth: []
 *     tags: [Admin]
 *     summary: Get all Designers
 *     description: Get a list of all Designers.
 *     responses:
 *       200:
 *         description: Successfully fetched all Designers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/designer'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 * /admin/Designers/{DesignerId}:
 *   get:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Get designer by ID
 *     description: Get an designer by its ID.s
 *     parameters:
 *       - name: DesignerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the designer.
 *     responses:
 *       200:
 *         description: Successfully fetched the designer.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/designer'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 *   put:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Update designer by ID
 *     description: Update designer details by its ID.
 *     parameters:
 *       - name: DesignerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the designer.
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
 *         description: designer updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: designer updated successfully
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 *   delete:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Delete designer by ID
 *     description: Delete an designer by its ID.
 *     parameters:
 *       - name: DesignerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the designer.
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
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 *
 * /admin/events:
 *   get:
 *     tags: [Admin]
 *     security:
 *      - cookieAuth: []
 *     summary: Get all events
 *     description: Get a list of all events.
 *     responses:
 *       200:
 *         description: Successfully fetched all events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
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
 * /admin/events/{eventId}:
 *   get:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Get event by ID
 *     description: Get an event by its ID.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event.
 *     responses:
 *       200:
 *         description: Successfully fetched the event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: Event not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Event not found
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
 *   put:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Update event by ID
 *     description: Update event details by its ID.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             example:
 *               title: Updated Event
 *               description: This is an updated event.
 *               location: 1234 Updated Street, Vancouver, BC, Canada
 *               start_date: 2023-08-01T18:00:00Z
 *               end_date: 2023-08-01T20:00:00Z
 *               catorgory: Fundraising
 *     responses:
 *       200:
 *         description: Event updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Event updated successfully
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: Event not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Event not found
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
 *   delete:
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     summary: Delete event by ID
 *     description: Delete an event by its ID.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event.
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
 *               example:
 *                 message: Event deleted successfully
 *       403:
 *         description: Forbidden. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Forbidden
 *       404:
 *         description: Event not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Event not found
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
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */
