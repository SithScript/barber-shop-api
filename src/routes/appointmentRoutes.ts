import { Router } from "express";
import AppointmentController from "../controller/AppointmentController.js";

const router = Router();

/**
 * @openapi
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Listar todos os agendamentos
 *     description: Retorna a lista de agendamentos cadastrados ordenados por data e hora.
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro interno ao buscar agendamentos.
 */
router.get("/", AppointmentController.getAll);

/**
 * @openapi
 * /appointments/service/{serviceId}:
 *   get:
 *     tags: [Appointments]
 *     summary: Listar agendamentos por serviço
 *     description: Retorna todos os agendamentos vinculados a um determinado serviço.
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         description: UUID do serviço
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Agendamentos retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: ID do serviço não informado.
 *       500:
 *         description: Erro interno ao buscar agendamentos por serviço.
 */
router.get("/service/:serviceId", AppointmentController.getByService);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Buscar agendamento por ID
 *     description: Retorna os dados detalhados de um agendamento específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do agendamento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Agendamento encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: ID do agendamento não informado.
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao buscar agendamento.
 */
router.get("/:id", AppointmentController.getById);

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Criar um novo agendamento
 *     description: Cria um novo agendamento para um cliente com validação de serviço ativo e verificação de conflito de horário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointment'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos, serviço inexistente/inativo ou horário já preenchido.
 *       404:
 *         description: Serviço informado não encontrado.
 *       500:
 *         description: Erro interno ao criar agendamento.
 */
router.post("/", AppointmentController.create);

/**
 * @openapi
 * /appointments/{id}/status:
 *   patch:
 *     tags: [Appointments]
 *     summary: Atualizar status do agendamento
 *     description: Atualiza o status do agendamento para 'agendado', 'finalizado' ou 'cancelado'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do agendamento
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointmentStatus'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Status informado inválido.
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao atualizar status.
 */
router.patch("/:id/status", AppointmentController.updateStatus);

/**
 * @openapi
 * /appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Atualizar dados de um agendamento
 *     description: Atualiza campos do agendamento (cliente, telefone, data/hora ou serviço).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do agendamento
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAppointment'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos para atualização.
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao atualizar agendamento.
 */
router.put("/:id", AppointmentController.update);

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Remover um agendamento
 *     description: Remove um agendamento pelo seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID do agendamento
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso.
 *       404:
 *         description: Agendamento não encontrado.
 *       500:
 *         description: Erro interno ao remover agendamento.
 */
router.delete("/:id", AppointmentController.remove);

export default router;
