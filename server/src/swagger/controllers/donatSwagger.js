/**
 * @swagger
 * /payment:
 *   get:
 *     summary: Get payments
 *     description: Get payments associated with the authenticated user.
 *     tags: [payment]
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Returns a list of payments associated with the authenticated user.
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/payment"
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
 * /payment/{id}:
 *   get:
 *     summary: Get a payment
 *     description: Get a specific payment associated with the authenticated user.
 *     tags: [payment]
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the payment to retrieve.
 *     responses:
 *       200:
 *         description: Returns the details of the specified payment associated with the authenticated user.
 *         schema:
 *           $ref: "#/definitions/payment"
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
 *         description: payment not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: payment not found
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
