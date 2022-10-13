const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type:
 *        object
 *      required:
 *       - title
 *       - author
 *      properties:
 *        id:
 *          type: string
 *          description: auto-generated id of the book
 *        title:
 *          type: string
 *          description: the title of the book
 *        author:
 *          type: string
 *          description: the author of the book
 */

/**
 * @swagger
 * tags:
 *   name : Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /books:
 *    get:
 *      summary: Returns a list of all the books
 *      tags: [Books]
 *      responses:
 *          200:
 *            description: The list of the books
 *            content:
 *              application/json:
 *                  schema:
 *                    type: array
 *                    items:
 *                      $ref: '#components/schemas/Book'
 *
 */

router.get("/", (req, res) => {
  const books = req.app.db.get("books");
  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *    get:
 *      summary: Get the book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Book id
 *      responses:
 *          200:
 *            description: Get book by id
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Book'
 *          404:
 *            description: Book was not found
 */

router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id }).value();
  if (!book) {
    res.sendStatus(404);
  }
  res.send(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *              $ref: '#components/schemas/Book'
 *     responses:
 *         200:
 *           description: Book was successfully created
 *           content:
 *             application/json:
 *                 schema:
 *                     $ref: '#components/schemas/Book'
 *         500:
 *           description: Some server error
 */

router.post("/", (req, res) => {
  try {
    const newBook = {
      id: nanoid(idLength),
      ...req.body,
    };
    req.app.db.get("books").push(newBook).write();
    res.send(newBook);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update specific book by its id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Book id
 *     requestBody:
 *        required: true
 *        content:
 *           application/json:
 *             schema:
 *              $ref: '#components/schemas/Book'
 *     responses:
 *         200:
 *           description: Book was successfully updated
 *         404:
 *           description: The Book was not found
 *         500:
 *           description: Some server error
 */

router.put("/:id", (req, res) => {
  try {
    req.app.db
      .get("books")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();

    res.send(req.app.db.get("books").find({ id: req.params.id }));
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /books/{id}:
 *    delete:
 *      summary: Delete the book by id
 *      tags: [Books]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Book id
 *      responses:
 *          200:
 *            description: Book was successfully deleted
 *          404:
 *            description: Book was not found
 *          500:
 *            description: Some server error
 */

router.delete("/:id", (req, res) => {
  try {
    req.app.db.get("books").remove({ id: req.params.id }).write();
    res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
