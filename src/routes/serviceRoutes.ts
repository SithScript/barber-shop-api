import { Router } from "express";
import ServiceController from "../controller/ServiceController.js";

const router = Router();

/**
 * @openapi
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Listar todos os serviços
 *     description: Retorna o catálogo completo de serviços da barbearia.
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erro interno ao buscar serviços.
 */
router.get("/", ServiceController.getAll);

/**
 * @openapi
 * /services/search/{keyword}:
 *   get:
 *     tags: [Services]
 *     summary: Pesquisar serviços por palavra-chave
 *     description: Retorna serviços com base no termo de busca (nome ou descrição).
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         description: Palavra-chave para busca
 *         schema:
 *           type: string
 *           example: Corte
 *     responses:
 *       200:
 *         description: Serviços encontrados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       400:
 *         description: Palavra-chave não informada.
 *       500:
 *         description: Erro interno ao pesquisar serviços.
 */
router.get("/search/:keyword", ServiceController.search);

/**
 * @openapi
 * /services/category/{categoryId}:
 *   get:
 *     tags: [Services]
 *     summary: Listar serviços por categoria
 *     description: Retorna todos os serviços pertencentes a uma categoria específica.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: UUID da categoria
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviços da categoria retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       400:
 *         description: ID da categoria não informado.
 *       500:
 *         description: Erro interno ao buscar serviços da categoria.
 */
router.get("/category/:categoryId", ServiceController.getByCategory);

/**
 * @openapi
 * /services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Buscar serviço por ID
 *     description: Retorna os dados detalhados de um serviço específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do serviço
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: ID do serviço não informado.
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao buscar serviço.
 */
router.get("/:id", ServiceController.getById);

/**
 * @openapi
 * /services:
 *   post:
 *     tags: [Services]
 *     summary: Cadastrar um novo serviço
 *     description: Cadastra um novo serviço associado a uma categoria existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateService'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos ou categoria informada não existe.
 *       500:
 *         description: Erro interno ao criar serviço.
 */
router.post("/", ServiceController.create);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Atualizar um serviço
 *     description: Atualiza os dados de um serviço existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do serviço
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateService'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Dados inválidos para atualização.
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao atualizar serviço.
 */
router.put("/:id", ServiceController.update);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Remover um serviço
 *     description: Remove um serviço do catálogo da barbearia.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do serviço
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso.
 *       400:
 *         description: Não é possível remover o serviço pois existem agendamentos associados.
 *       404:
 *         description: Serviço não encontrado.
 *       500:
 *         description: Erro interno ao remover serviço.
 */
router.delete("/:id", ServiceController.remove);

export default router;
