const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const RepairRecordController = {
    list: async () => {
        try {
            const repairRecords = await prisma.repairRecord.findMany({
                include: {
                    device: true,
                    user: true
                },
                orderBy: {
                    id: "desc"
                }
            });
         
          // ตรวจสอบว่า engineerId มีค่าไหม ถ้ามีค่าให้หา username ของ engineer มาเพิ่มใน list
          let list = [];

          for (const repairRecord of repairRecords) {
              if (repairRecord.engineerId) {
                  const engineer = await prisma.user.findUnique({
                      select: {
                          username: true
                      },
                      where: {
                          id: repairRecord.engineerId
                      }
                  });

                  list.push({ ...repairRecord, engineer });
              } else {
                  list.push(repairRecord);
              }
          }

          return list;
      } catch (error) {
          return error;
      }
  },
    create: async ({ body,request, jwt }: {
        body: {
            costomerName: string;
            costomerPhone: string;
            deviceName: string;
            deviceId?: number;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            soviet?: string;
            expireDate?: Date;
        },
        request: any,
        jwt: any
    }) => {
        try {
                const row = await prisma.repairRecord.create({
                data: body
            });
            return { message: "success", data: row };
        } catch (error) {
            return error;
        }
    },
    checkDeviceSerial: async({ params }: { params: { deviceSerial: string } }) => {
        try {
            const RepairRecord = await prisma.RepairRecord.findFirst({
                where: { 
                    deviceSerial: params.deviceSerial,
                    
                }
            });
            
            // ถ้าเจอ user จะ return true (มีซ้ำ)
            // ถ้าไม่เจอ user จะ return false (ไม่ซ้ำ)
            return RepairRecord ? true : false;
        } catch (error) {
            return error;
        }
    },
    update: async ({ params, body }: {
        body: {
            costomerName: string;
            costomerPhone: string;
            deviceName: string;
            deviceId?: number;
            deviceBarcode: string;
            deviceSerial?: string;
            problem: string;
            soviet?: string;
            expireDate?: Date;
        },
        params: { id: string }
    }) => {
        try {
             await prisma.repairRecord.update({
                where: { 
                    id: parseInt(params.id) 
                },
                data: body
            });
            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    remove: async ({ params }: { 
        params: { 
            id: string; 
        } 
    }) => {
        try {
            await prisma.repairRecord.update({ 
                where: { id: parseInt(params.id) 
                },
                data: { 
                    status: "inactive" 
                }
             });
            return { message: "Delete success" };
        } catch (error) {
            return error;
        }
    },
    updateStatus: async ({ params, body }: {
        body: {
            status: string;
            soviet: string;
            engineerId: string;
        },
        params: { id: string }
    }) => {
        try {
            await prisma.repairRecord.update({
                where: { id: parseInt(params.id) },
                data: body
            });
            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    recive: async ({ body }: {
        body: {
            amount: number;
            id: number;
        },
    }) => {
        try {
            await prisma.repairRecord.update({
                where: { 
                    id: body.id },
                data: {
                    amount: body.amount,
                    payDate: new Date(),
                    status: "complete"
                }
            });
            return { message: "success" };
        } catch (error) {
            return error;
        }
    },
    report: async ({ params }: {
        params: {
            startDate: string;
            endDate: string;
        }
    }) => {
        try {
            const startDate = new Date(params.startDate);
            const endDate = new Date(params.endDate);

            startDate.setHours(0, 0, 0, 0);          // เวลา 00:00:00:000
            endDate.setHours(23, 59, 59, 999);       // เวลา 23:59:59:999

            const repairRecords = await prisma.repairRecord.findMany({
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: "complete"
                }
            });

            return repairRecords;
        } catch (error) {
            return error;
        }
    },
    
}

