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
    id: "joalheria-elegancia",
    title: "Joalheria Elegância",
    description: "Joias exclusivas e sofisticadas para momentos inesquecíveis.",
    url: "https://joalheriaelegancia.lovable.app/",
    image_url: null,
  },
  {
    id: "body-transform",
    title: "Body Transform Academia",
    description: "Transforme seu corpo e sua saúde com nosso acompanhamento profissional.",
    url: "https://bodytransform.lovable.app",
    image_url: null,
  },
  {
    id: "nagate-bebidas",
    title: "Nagate Bebidas",
    description: "As melhores bebidas com entrega rápida e gelada.",
    url: "https://nagatebebidas.lovable.app",
    image_url: null,
  },
  {
    id: "mp-guincho",
    title: "MP Guincho",
    description: "Serviço de guincho 24 horas com rapidez e segurança.",
    url: "https://mpguincho.lovable.app",
    image_url: null,
  },
  {
    id: "rei-dos-colchoes",
    title: "O Rei dos Colchões",
    description: "O melhor descanso para você e sua família.",
    url: "https://reidoscolchoes.lovable.app",
    image_url: null,
  },
  {
    id: "helena-moura-vet",
    title: "Dra. Helena Moura - Veterinária",
    description: "Cuidado especializado e amoroso para o seu pet.",
    url: "https://drhelenavet.lovable.app/",
    image_url: null,
  },
  {
    id: "fabiana-casagranda-nutri",
    title: "Fabiana Casagranda - Nutricionista",
    description: "Nutrição personalizada para uma vida mais saudável e equilibrada.",
    url: "https://fabinutri.vercel.app/",
    image_url: null,
  },
  {
    id: "foca-no-cell",
    title: "Foca no Cell",
    description: "Assistência técnica e acessórios para o seu smartphone.",
    url: "https://focanocell.vercel.app/",
    image_url: null,
  },
  {
    id: "fort-consultoria",
    title: "FORT Consultoria",
    description: "Especialistas em Segurança do Trabalho e Saúde Ocupacional.",
    url: "https://www.fortsst.com.br/",
    image_url: null,
  },
  {
    id: "offs-na-hora",
    title: "Offs Na Hora",
    description: "Locuções e gravações profissionais com entrega rápida.",
    url: "https://www.offsnahora.com.br/",
    image_url: null,
  },
  {
    id: "32bda2e4-66e3-40d4-bb7c-b19573ca2e6c",
    title: "O Meu Cofrinho",
    description: "Plataforma de controle financeiro pessoal simples e eficiente.",
    url: "https://www.omeucofrinho.com.br/",
    image_url: oMeuCofrinhoPreview,
  },
  {
    id: "18641aa7-d3f4-4b00-a032-11ac7545e2e1",
    title: "Dr Thor Suplementos",
    description: "A maior variedade de suplementos com o melhor preço.",
    url: "https://dr-thor-suplementos.vercel.app/",
    image_url: drThorPreview,
  },
  {
    id: "4940efc9-d4f6-47c7-927d-e3284121843e",
    title: "Burger Venezuelano Express",
    description: "O verdadeiro sabor da Venezuela em hambúrgueres artesanais.",
    url: "https://burger-venezuelano-express.vercel.app/",
    image_url: burgerVenezuelanoPreview,
  },
  {
    id: "7f64a535-a6cb-470b-9eda-1e3dc03a6e8f",
    title: "Nutrigen",
    description: "Sua saúde através da genética e nutrição de precisão.",
    url: "https://nutrigen-fawn.vercel.app/",
    image_url: nutrigenPreview,
  },
  {
    id: "4fde6e9f-89fc-4e21-a7a3-a7ca52377bd8",
    title: "GlobalMS Glow Up",
    description: "Tecnologia e inovação para o crescimento do seu negócio.",
    url: "https://globalms-glow-up.vercel.app/",
    image_url: globalMsPreview,
  },
  {
    id: "2271ee3b-49d3-4a8c-b126-1b8ea7d30033",
    title: "CV Fácil",
    description: "Crie seu currículo profissional em minutos de forma gratuita.",
    url: "https://cvfacil-ten.vercel.app/",
    image_url: cvFacilPreview,
  },
];
