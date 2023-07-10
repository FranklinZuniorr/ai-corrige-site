export const KEY_COOKIE_ACCESS = "ta-access";
export const KEY_COOKIE_REFRESH = "ta-refresh";
export const OPTIONS_THEME = {
    LINGUAGENS_CÓDIGOS_E_SUAS_TECNOLOGIAS: "Língua Portuguesa, Literatura, Língua Estrangeira (Inglês ou Espanhol), Artes, Educação Física, Tecnologias da Informação e Comunicação.",
    CIÊNCIAS_HUMANAS_E_SUAS_TECNOLOGIAS: "História, Geografia, Filosofia e Sociologia.",
    CIÊNCIAS_DA_NATUREZA_E_SUAS_TECNOLOGIAS: "Biologia, Física e Química.",
    MATEMÁTICA_E_SUAS_TECNOLOGIAS: "Matemática, com contas, expressões, funções, álgebra, Geometria, Estatística, Trigonometria, Números, tudo.",
    GERAL: "acontecimentos históricos no mundo."

};
export const OPTIONS_INPUT_THEME = [
    {key: OPTIONS_THEME.LINGUAGENS_CÓDIGOS_E_SUAS_TECNOLOGIAS, text: "Linguagens códigos e suas tecnologias", value: OPTIONS_THEME.LINGUAGENS_CÓDIGOS_E_SUAS_TECNOLOGIAS},
    {key: OPTIONS_THEME.CIÊNCIAS_HUMANAS_E_SUAS_TECNOLOGIAS, text: "Ciências humanas e suas tecnologias", value: OPTIONS_THEME.CIÊNCIAS_HUMANAS_E_SUAS_TECNOLOGIAS},
    {key: OPTIONS_THEME.CIÊNCIAS_DA_NATUREZA_E_SUAS_TECNOLOGIAS, text: "Ciências da natureza e suas tecnologias", value: OPTIONS_THEME.CIÊNCIAS_DA_NATUREZA_E_SUAS_TECNOLOGIAS},
    {key: OPTIONS_THEME.MATEMÁTICA_E_SUAS_TECNOLOGIAS, text: "Matemática e suas tecnologias", value: OPTIONS_THEME.MATEMÁTICA_E_SUAS_TECNOLOGIAS},
    {key: OPTIONS_THEME.GERAL, text: "Acontecimentos globais", value: OPTIONS_THEME.GERAL},
];
export const OPTIONS_DIFFICULTY = [
    {key: "DIFÍCIL", text: "Difícil", value: "difícil"},
    {key: "MÉDIO", text: "Médio", value: "Médio"},
    {key: "FÁCIL", text: "Fácil", value: "Fácil"},
];
export const TEMPLATE_QUERY_AMQP = {
    title: "",
    msg: "",
    schema: {
      name: "criar_texto_e_questoes",
      description: "Gera resumo, questões e alternativas.",
      parameters: {
        type: "object",
        properties: {
          resumo: {
            type: "string",
            description: "Resumo."
          },
          questao1: {
            type: "object",
            description: "Questão 1 sobre o resumo com alternativas de A até D, e com a alternativa correta.",
            properties: {
              pergunta: {
                type: "string",
                description: "Pergunta 1 referente ao texto gerado."
              },
              A: {
                type: "string",
                description: "Alternativa A"
              },
              B: {
                type: "string",
                description: "Alternativa B"
              },
              C: {
                type: "string",
                description: "Alternativa C"
              },
              D: {
                type: "string",
                description: "Alternativa D"
              },
              alternativa_correta: {
                type: "string",
                description: "Alternativa correta entre A e D."
              }
            },
            required: [
              "pergunta",
              "A",
              "B",
              "C",
              "D",
              "alternativa_correta"
            ]
          },
          questao2: {
            type: "object",
            description: "Questão 2 sobre o resumo com alternativas de A até D, e com a alternativa correta.",
            properties: {
              pergunta: {
                type: "string",
                description: "Pergunta 2 referente ao texto gerado."
              },
              A: {
                type: "string",
                description: "Alternativa A"
              },
              B: {
                type: "string",
                description: "Alternativa B"
              },
              C: {
                type: "string",
                description: "Alternativa C"
              },
              D: {
                type: "string",
                description: "Alternativa D"
              },
              alternativa_correta: {
                type: "string",
                description: "Alternativa correta entre A e D."
              }
            },
            required: [
              "pergunta",
              "A",
              "B",
              "C",
              "D",
              "alternativa_correta"
            ]
          },
          questao3: {
            type: "object",
            description: "Questão 3 sobre o resumo com alternativas de A até D, e com a alternativa correta.",
            properties: {
              pergunta: {
                type: "string",
                description: "Pergunta 3 referente ao texto gerado."
              },
              A: {
                type: "string",
                description: "Alternativa A"
              },
              B: {
                type: "string",
                description: "Alternativa B"
              },
              C: {
                type: "string",
                description: "Alternativa C"
              },
              D: {
                type: "string",
                description: "Alternativa D"
              },
              alternativa_correta: {
                type: "string",
                description: "Alternativa correta entre A e D."
              }
            },
            required: [
              "pergunta",
              "A",
              "B",
              "C",
              "D",
              "alternativa_correta"
            ]
          },
          questao4: {
            type: "object",
            description: "Questão 4 sobre o resumo com alternativas de A até D, e com a alternativa correta.",
            properties: {
              pergunta: {
                type: "string",
                description: "Pergunta 4 referente ao texto gerado."
              },
              A: {
                type: "string",
                description: "Alternativa A"
              },
              B: {
                type: "string",
                description: "Alternativa B"
              },
              C: {
                type: "string",
                description: "Alternativa C"
              },
              D: {
                type: "string",
                description: "Alternativa D"
              },
              alternativa_correta: {
                type: "string",
                description: "Alternativa correta entre A e D."
              }
            },
            required: [
              "pergunta",
              "A",
              "B",
              "C",
              "D",
              "alternativa_correta"
            ]
          },
          questao5: {
            type: "object",
            description: "Questão 5 sobre o resumo com alternativas de A até D, e com a alternativa correta.",
            properties: {
              pergunta: {
                type: "string",
                description: "Pergunta 5 referente ao texto gerado."
              },
              A: {
                type: "string",
                description: "Alternativa A"
              },
              B: {
                type: "string",
                description: "Alternativa B"
              },
              C: {
                type: "string",
                description: "Alternativa C"
              },
              D: {
                type: "string",
                description: "Alternativa D"
              },
              alternativa_correta: {
                type: "string",
                description: "Alternativa correta entre A e D."
              }
            },
            required: [
              "pergunta",
              "A",
              "B",
              "C",
              "D",
              "alternativa_correta"
            ]
          }
        },
        required: [
          "resumo",
          "questao1",
          "questao2",
          "questao3",
          "questao4",
          "questao5"
        ]
      }
    }
  };