import oMeuCofrinhoPreview from "@/assets/site-previews/omeucofrinho.png";
import drThorPreview from "@/assets/site-previews/dr-thor-suplementos.png";
import burgerVenezuelanoPreview from "@/assets/site-previews/burger-venezuelano-express.png";
import nutrigenPreview from "@/assets/site-previews/nutrigen.png";
import globalMsPreview from "@/assets/site-previews/globalms-glow-up.png";
import cvFacilPreview from "@/assets/site-previews/cv-facil.png";

export interface Site {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
}

export const portfolioSites: Site[] = [
  {
    id: "32bda2e4-66e3-40d4-bb7c-b19573ca2e6c",
    title: "O Meu Cofrinho",
    description: "Plataforma de controle financeiro pessoal com planos gratuitos e premium para organizar suas finanças de forma simples.",
    url: "https://www.omeucofrinho.com.br/",
    image_url: oMeuCofrinhoPreview,
  },
  {
    id: "18641aa7-d3f4-4b00-a032-11ac7545e2e1",
    title: "Dr. Thor Suplementos",
    description: "Loja de suplementos com entrega exclusiva em Três Lagoas - MS e atendimento direto pelo WhatsApp.",
    url: "https://dr-thor-suplementos.vercel.app/",
    image_url: drThorPreview,
  },
  {
    id: "4940efc9-d4f6-47c7-927d-e3284121843e",
    title: "Burger Venezuelano Express",
    description: "Cardápio digital de hamburgueria venezuelana com pedidos online e retirada na loja.",
    url: "https://burger-venezuelano-express.vercel.app/",
    image_url: burgerVenezuelanoPreview,
  },
  {
    id: "7f64a535-a6cb-470b-9eda-1e3dc03a6e8f",
    title: "Nutrigen",
    description: "Gerador de planos alimentares personalizados com cálculo de calorias e macros em minutos.",
    url: "https://nutrigen-fawn.vercel.app/",
    image_url: nutrigenPreview,
  },
  {
    id: "4fde6e9f-89fc-4e21-a7a3-a7ca52377bd8",
    title: "GlobalMS Glow Up",
    description: "Site institucional da Global Informática com soluções em redes, telefonia, monitoramento e automação desde 2007.",
    url: "https://globalms-glow-up.vercel.app/",
    image_url: globalMsPreview,
  },
  {
    id: "2271ee3b-49d3-4a8c-b126-1b8ea7d30033",
    title: "CV Fácil",
    description: "Ferramenta gratuita para criar currículos profissionais em PDF com preview em tempo real.",
    url: "https://cvfacil-ten.vercel.app/",
    image_url: cvFacilPreview,
  },
];
