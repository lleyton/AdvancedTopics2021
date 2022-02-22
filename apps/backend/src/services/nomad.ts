import axios from "axios";

export const nomad = axios.create({
  baseURL: process.env["NOMAD_URL"]!,
  headers: {
    "X-Nomad-Token": process.env["NOMAD_TOKEN"]!,
  },
});
