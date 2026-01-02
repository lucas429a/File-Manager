/**
 * Tag Integrator - Entry Point
 * 
 * Sistema de conversão e geração de etiquetas para empresas de varejo.
 * Arquitetura: Domain-Driven Design (DDD)
 * 
 * @author Lucas
 * @description Ponto de entrada da aplicação usando nova arquitetura DDD
 */

import 'dotenv/config'
import { startServer } from './presentation/http/server'

// Inicia o servidor HTTP
const port = Number(process.env.SERVER_PORT) || 3000
startServer(port)
