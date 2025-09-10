package io.github.icon02.helpdeskfullstacksearchdemobackend.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

public class SearchTermUtil {
    // Split into either "quoted phrase" or a non-space token
    private static final Pattern TOKENIZER = Pattern.compile("\"([^\"]+)\"|(\\S+)");
    // Gender punctuation chars we normalize away when deriving a base token
    private static final Pattern GENDER_PUNCT = Pattern.compile("[:*_/·()\\[\\]-]+");
    // Keep only letters or digits in lexemes for to_tsquery safety
    private static final Pattern NON_ALNUM = Pattern.compile("[^\\p{IsLetter}\\p{IsDigit}]+");

    public static String toTsQuery(String raw) {
        if (raw == null) return "";
        raw = raw.trim();
        if (raw.isEmpty()) return "";

        StringBuilder out = new StringBuilder();
        String pendingOp = "&"; // default operator between terms
        boolean first = true;

        var m = TOKENIZER.matcher(raw);
        while (m.find()) {
            String phrase = m.group(1);
            String token  = m.group(2);

            if (token != null && isOr(token)) {
                pendingOp = "|";        // next connective will be OR
                continue;
            }

            boolean negate = false;
            if (token != null && (token.startsWith("-") || token.startsWith("!"))) {
                negate = true;
                token = token.substring(1);
            }

            String expr;
            if (phrase != null) {
                expr = buildPhraseExpr(phrase);
            } else {
                expr = buildTokenExpr(token);
            }

            if (expr.isEmpty()) continue; // skip empties

            if (negate) expr = "!(" + expr + ")";

            if (!first) out.append(' ').append(pendingOp).append(' ');
            out.append('(').append(expr).append(')');
            first = false;
            pendingOp = "&"; // reset to default
        }

        return out.toString();
    }

    /** Build tsquery for a single token with optional gender variant expansion. */
    private static String buildTokenExpr(String rawToken) {
        if (rawToken == null) return "";
        String token = rawToken.trim();
        if (token.isEmpty()) return "";

        boolean genderHint = hasGenderPunct(token) || token.endsWith("in") || token.endsWith("innen");

        // Base: take part before any gender punctuation, then sanitize
        String base = sanitize(firstPart(token));
        if (base.isEmpty()) base = sanitize(token);
        if (base.isEmpty()) return "";

        List<String> variants = new ArrayList<>();
        variants.add(base);

        if (genderHint) {
            // Only expand when there is a hint (prevents noise like "mein"→"meinin")
            variants.add(base + "in");
            variants.add(base + "innen");
        }

        // "'lex':* | 'lexin':* | 'lexinnen':*"
        return joinOr(variants.stream().map(v -> quoteLexeme(v) + ":*").toList());
    }

    /** Build tsquery for a quoted phrase: "'reset' <-> 'password':*" */
    private static String buildPhraseExpr(String phrase) {
        if (phrase == null) return "";
        // Split phrase words on whitespace and gender punctuation
        String[] parts = GENDER_PUNCT.matcher(phrase.trim()).replaceAll(" ").split("\\s+");
        List<String> lex = new ArrayList<>();
        for (String p : parts) {
            String s = sanitize(p);
            if (!s.isEmpty()) lex.add(s);
        }
        if (lex.isEmpty()) return "";

        if (lex.size() == 1) {
            // Single word phrase: treat as a token with prefix
            return quoteLexeme(lex.get(0)) + ":*";
        }

        // Build adjacency with <-> ; prefix-match only on the last lexeme
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < lex.size(); i++) {
            if (i > 0) sb.append(" <-> ");
            sb.append(quoteLexeme(lex.get(i)));
            if (i == lex.size() - 1) sb.append(":*");
        }
        return sb.toString();
    }

    private static boolean isOr(String token) {
        String t = token.trim();
        return t.equalsIgnoreCase("or") || t.equals("||");
    }

    private static boolean hasGenderPunct(String s) {
        return GENDER_PUNCT.matcher(s).find();
    }

    private static String firstPart(String s) {
        // take the chunk before any gender punctuation
        String[] parts = GENDER_PUNCT.matcher(s).replaceAll(" ").split("\\s+");
        return parts.length > 0 ? parts[0] : s;
    }

    private static String sanitize(String s) {
        if (s == null) return "";
        return NON_ALNUM.matcher(s.toLowerCase(Locale.ROOT)).replaceAll("");
    }

    private static String quoteLexeme(String lex) {
        // Single-quote and escape single quotes for to_tsquery literal
        return "'" + lex.replace("'", "''") + "'";
    }

    private static String joinOr(List<String> parts) {
        return String.join(" | ", parts);
    }

}
