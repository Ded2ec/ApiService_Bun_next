const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

export const DepartmentController = {
    list: async () => {
        try {
            const departments = await prisma.department.findMany({
            where:{
                status:'active'
            },
            orderBy:{
                name:'asc'
            }
        })
        return departments;
    }catch(error){
        return error;
    }   
}
}