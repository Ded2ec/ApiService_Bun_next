const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

export const SectionController = {
    listByDepartment: async ({ params }: {
        params: {
            departmentId: string
        }
    }) => {
        try {
            const sections = await prisma.section.findMany({
                where: {
                    status: 'active',
                    departmentId: parseInt(params.departmentId)
                },
                orderBy: {
                    name: 'asc'
                }
            })

            return sections
        } catch (error) {
            return error
        }
    }
}