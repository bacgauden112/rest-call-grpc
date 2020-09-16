require('dotenv').config()

const PROTO_PATH = './notes.proto';
const grpc = require('grpc');
const NoteService = grpc.load(PROTO_PATH).NoteService
const client = new NoteService(process.env.GRPC_API, grpc.credentials.createInsecure());

module.exports = client