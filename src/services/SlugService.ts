import { ObjectLiteral, Repository } from "typeorm";

export class SlugService {
    // "Notebook Gamer Ção" -> "notebook-gamer-cao"
    static slugify(text: string): string {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    // Garante que o slug seja único, acrescentando -2, -3... se já existir
    static async generateUnique<T extends ObjectLiteral>(
        repository: Repository<T>,
        text: string,
        ignoreId?: number
    ): Promise<string> {
        const base = SlugService.slugify(text) || "produto";
        let slug = base;
        let counter = 2;

        while (true) {
            const found = await repository.findOne({ where: { slug } as any });
            if (!found || (ignoreId !== undefined && (found as any).id === ignoreId)) {
                return slug;
            }
            slug = `${base}-${counter}`;
            counter++;
        }
    }
}