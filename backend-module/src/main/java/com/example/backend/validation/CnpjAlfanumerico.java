package com.example.backend.validation;

import java.util.Locale;
import java.util.regex.Pattern;

/**
 * CNPJ alfanumérico (Receita Federal): normalização, padrão e DV (módulo 11,
 * valor = código ASCII − 48; pesos iguais ao CNPJ numérico clássico).
 * Espelha {@code frontend/src/app/core/utils/cnpj-alfanumerico.ts}.
 */
public final class CnpjAlfanumerico {

    /** Mesmo que {@code CNPJ_NORMALIZED_PATTERN} no TS: 12 alfanuméricos + 2 dígitos. */
    public static final Pattern CNPJ_NORMALIZED_PATTERN = Pattern.compile("[A-Z0-9]{12}[0-9]{2}");

    /**
     * Caracteres aceitos na entrada bruta: alfanuméricos + caracteres da máscara
     * ({@code .}, {@code /}, {@code -}) + espaços em branco. Qualquer outro símbolo
     * (ex.: {@code *}, {@code @}, acentos) é tratado como inválido — atende ao
     * requisito EF/ET "Não permitir caracteres especiais (exceto máscara)".
     */
    public static final Pattern ALLOWED_INPUT_PATTERN = Pattern.compile("[0-9A-Za-z./\\-\\s]*");

    private static final int[] WEIGHTS_DV1 = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
    private static final int[] WEIGHTS_DV2 = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    private CnpjAlfanumerico() {}

    /** Mantém apenas letras e dígitos e converte letras para maiúsculas ({@link Locale#ROOT}). */
    public static String normalize(String value) {
        if (value == null || value.isEmpty()) {
            return "";
        }
        return value.replaceAll("[^0-9A-Za-z]", "").toUpperCase(Locale.ROOT);
    }

    public static int cnpjCharValue(char ch) {
        char upper = Character.toUpperCase(ch);
        int code = upper;
        if (code >= 48 && code <= 57) {
            return code - 48;
        }
        if (code >= 65 && code <= 90) {
            return code - 48;
        }
        return -1;
    }

    /** String já com 14 caracteres normalizados; exige padrão e DV corretos. */
    public static boolean isValidCnpjAlfanumericoDv(String normalized14) {
        if (normalized14 == null
                || normalized14.length() != 14
                || !CNPJ_NORMALIZED_PATTERN.matcher(normalized14).matches()) {
            return false;
        }
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            int v = cnpjCharValue(normalized14.charAt(i));
            if (v < 0) {
                return false;
            }
            sum += v * WEIGHTS_DV1[i];
        }
        int rest = sum % 11;
        int dv1 = rest < 2 ? 0 : 11 - rest;
        if (dv1 != normalized14.charAt(12) - '0') {
            return false;
        }
        sum = 0;
        for (int i = 0; i < 12; i++) {
            sum += cnpjCharValue(normalized14.charAt(i)) * WEIGHTS_DV2[i];
        }
        sum += dv1 * WEIGHTS_DV2[12];
        rest = sum % 11;
        int dv2 = rest < 2 ? 0 : 11 - rest;
        return dv2 == normalized14.charAt(13) - '0';
    }

    /** Mesma ordem do TS: rejeita caracteres fora da máscara, normaliza, tamanho 14, regex, depois DV. */
    public static boolean isValid(String value) {
        if (value == null || !ALLOWED_INPUT_PATTERN.matcher(value).matches()) {
            return false;
        }
        String n = normalize(value);
        if (n.length() != 14) {
            return false;
        }
        if (!CNPJ_NORMALIZED_PATTERN.matcher(n).matches()) {
            return false;
        }
        return isValidCnpjAlfanumericoDv(n);
    }
}
