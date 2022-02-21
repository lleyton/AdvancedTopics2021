import axios from "axios";

export const nomad = axios.create({
  baseURL: "http://95.216.223.146:4646/v1",
  headers: {
    "X-Nomad-Token": process.env["NOMAD_TOKEN"]!,
  },
});
