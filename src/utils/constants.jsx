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