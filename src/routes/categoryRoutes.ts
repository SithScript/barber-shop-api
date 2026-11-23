import { Router } from "express";
import CategoryController from "../controller/CategoryController.js";

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar todas as categorias
 *     description: Retorna todas as categorias cadastradas na barbearia.
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro interno ao buscar categorias.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", CategoryController.getAll);

/**
 * @openapi
 * /categories/search/{keyword}:
 *   get:
 *     tags: [Categories]
 *     summary: Buscar categorias por palavra-chave
 *     description: Retorna categorias que contenham o termo pesquisado no nome ou na descrição.
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         description: Termo de pesquisa
 *         schema:
 *           type: string
 *           example: Cabelo
 *     responses:
 *       200:
 *         description: Categorias encontradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       400:
 *         description: Palavra-chave não informada.
 *       500:
 *         description: Erro interno ao pesquisar categorias.
 */
router.get("/search/:keyword", CategoryController.getByKeyword);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Buscar categoria por ID
 *     description: Retorna os dados de uma categoria específica pelo seu identificador único.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador UUID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID da categoria inválido ou não informado.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno ao buscar categoria.
 */
router.get("/:id", CategoryController.getById);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Cadastrar uma nova categoria
 *     description: Cria uma nova categoria de serviços para a barbearia.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       201:
 *         description: Categoria cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos para cadastro da categoria.
 *       500:
 *         description: Erro interno ao criar categoria.
 */
router.post("/", CategoryController.create);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Atualizar uma categoria
 *     description: Atualiza os dados de uma categoria existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador UUID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos para atualização.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno ao atualizar categoria.
 */
router.put("/:id", CategoryController.update);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Remover uma categoria
 *     description: Remove uma categoria pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador UUID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno ao remover categoria.
 */
router.delete("/:id", CategoryController.remove);

export default router;
