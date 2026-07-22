/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Get health status
 *     description: Returns the current health status of the API and its database connection.
 *     responses:
 *       200:
 *         description: Service is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Service is healthy.
 *                 data:
 *                   $ref: '#/components/schemas/HealthStatus'
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login
 *     description: |
 *       Authenticates a user and creates a new session.
 *       Returns an access token in the response body and sets a `refreshToken` HttpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly refresh token cookie.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 data:
 *                   $ref: '#/components/schemas/LoginData'
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             example:
 *               success: false
 *               message: The email or password you entered is incorrect.
 *               errors: []
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: |
 *       Issues a new access token using the refresh token from the HttpOnly cookie.
 *       The refresh token is rotated on every successful refresh.
 *     security:
 *       - refreshCookie: []
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
 *         headers:
 *           Set-Cookie:
 *             description: New HttpOnly refresh token cookie.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully.
 *                 data:
 *                   $ref: '#/components/schemas/RefreshData'
 *       401:
 *         description: Session expired or refresh token missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *             example:
 *               success: false
 *               message: Your session has expired. Please sign in again.
 *               errors: []
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout
 *     description: Revokes the current session and clears the refresh token cookie.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *                 data:
 *                   $ref: '#/components/schemas/EmptyObject'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user
 *     description: Returns the authenticated user's profile, role, and permissions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/AuthUser'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard
 *     description: Returns all information required to render the dashboard. Requires `VIEW_DASHBOARD` permission.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Dashboard retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/DashboardData'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: List tickets
 *     description: Returns a paginated list of tickets with search, filter, and sort support. Requires `VIEW_TICKETS` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by ticket number, title, or description.
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/TicketStatus'
 *       - in: query
 *         name: priority
 *         schema:
 *           $ref: '#/components/schemas/TicketPriority'
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *         description: User UUID or `me`.
 *       - in: query
 *         name: reporter
 *         schema:
 *           type: string
 *         description: User UUID or `me`.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           $ref: '#/components/schemas/TicketSortField'
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           $ref: '#/components/schemas/SortOrder'
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Tickets retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedTicketList'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     tags: [Tickets]
 *     summary: Create ticket
 *     description: Creates a new support ticket. Requires `CREATE_TICKET` permission.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketRequest'
 *     responses:
 *       201:
 *         description: Ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Ticket created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/CreateTicketResult'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @openapi
 * /tickets/{id}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get ticket details
 *     description: Returns a single ticket including comments and activity history. Requires `VIEW_TICKETS` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Ticket retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/TicketDetail'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   patch:
 *     tags: [Tickets]
 *     summary: Update ticket
 *     description: |
 *       Updates one or more ticket fields. Only supplied fields are updated.
 *       Requires `UPDATE_TICKET` permission. Every successful update creates an Activity record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketRequest'
 *     responses:
 *       200:
 *         description: Ticket updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Ticket updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/EmptyObject'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   delete:
 *     tags: [Tickets]
 *     summary: Delete ticket
 *     description: Permanently deletes a ticket. Requires `DELETE_TICKET` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Ticket deleted successfully.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @openapi
 * /tickets/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get ticket comments
 *     description: Returns all comments for a ticket, newest first. Requires `VIEW_TICKETS` permission.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Comments retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommentItem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 *   post:
 *     tags: [Comments]
 *     summary: Add comment
 *     description: |
 *       Adds a new comment to a ticket. Requires `ADD_COMMENT` permission.
 *       A corresponding Activity record is automatically created.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, data]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   enum: [true]
 *                 message:
 *                   type: string
 *                   example: Comment added successfully.
 *                 data:
 *                   $ref: '#/components/schemas/EmptyObject'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */

export {};
