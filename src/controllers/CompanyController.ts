const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const CompanyController = {
    info: async () => {
        try {
            const company = await prisma.company.findFirst();

            if (!company) {
                return { message: "company not found" };
            }

            return company;
        } catch (error) {
            return error;
        }
    },
    update: async ({ body }: {
        body: {
            name: string;
            address: string;
            phone: string;
            email: string;
            facebookPage: string;
            taxCode: string;
        }
    }) => {
        try {
            let oldCompany = await prisma.company.findFirst();

            if (!oldCompany) {
                await prisma.company.create({
                    data: body
                });
            } else {
                await prisma.company.update({
                    where: { id: oldCompany.id },
                    data: body
                });
            }

            return { message: "success" };
        } catch (error) {
            return error;
        }
    }
}