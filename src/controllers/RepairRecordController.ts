const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require('dayjs');



export const RepairRecordController = {
  list: async () => {
    try {
      const repairRecords = await prisma.repairRecord.findMany({
        include: {
          device: true,
          user: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      // ตรวจสอบว่า engineerId มีค่าไหม ถ้ามีค่าให้หา username ของ engineer มาเพิ่มใน list
      let list = [];

      for (const repairRecord of repairRecords) {
        if (repairRecord.engineerId) {
          const engineer = await prisma.user.findUnique({
            select: {
              username: true,
            },
            where: {
              id: repairRecord.engineerId,
            },
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
  create: async ({
    body,
    request,
    jwt,
  }: {
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
    };
    request: any;
    jwt: any;
  }) => {
    try {
      const row = await prisma.repairRecord.create({
        data: body,
      });
      return { message: "success", data: row };
    } catch (error) {
      return error;
    }
  },
  checkDeviceSerial: async ({
    params,
  }: {
    params: { deviceSerial: string };
  }) => {
    try {
      const RepairRecord = await prisma.RepairRecord.findFirst({
        where: {
          deviceSerial: params.deviceSerial,
        },
      });

      // ถ้าเจอ user จะ return true (มีซ้ำ)
      // ถ้าไม่เจอ user จะ return false (ไม่ซ้ำ)
      return RepairRecord ? true : false;
    } catch (error) {
      return error;
    }
  },
  update: async ({
    params,
    body,
  }: {
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
    };
    params: { id: string };
  }) => {
    try {
      await prisma.repairRecord.update({
        where: {
          id: parseInt(params.id),
        },
        data: body,
      });
      return { message: "success" };
    } catch (error) {
      return error;
    }
  },
  remove: async ({
    params,
  }: {
    params: {
      id: string;
    };
  }) => {
    try {
      await prisma.repairRecord.update({
        where: { id: parseInt(params.id) },
        data: {
          status: "inactive",
        },
      });
      return { message: "Delete success" };
    } catch (error) {
      return error;
    }
  },
  updateStatus: async ({
    params,
    body,
  }: {
    body: {
      status: string;
      soviet: string;
      engineerId: string;
    };
    params: { id: string };
  }) => {
    try {
      await prisma.repairRecord.update({
        where: { id: parseInt(params.id) },
        data: body,
      });
      return { message: "success" };
    } catch (error) {
      return error;
    }
  },
  recive: async ({
    body,
  }: {
    body: {
      amount: number;
      id: number;
    };
  }) => {
    try {
      await prisma.repairRecord.update({
        where: {
          id: body.id,
        },
        data: {
          amount: body.amount,
          payDate: new Date(),
          status: "complete",
        },
      });
      return { message: "success" };
    } catch (error) {
      return error;
    }
  },
  report: async ({
    params,
  }: {
    params: {
      startDate: string;
      endDate: string;
    };
  }) => {
    try {
      const startDate = new Date(params.startDate);
      const endDate = new Date(params.endDate);

      startDate.setHours(0, 0, 0, 0); // เวลา 00:00:00:000
      endDate.setHours(23, 59, 59, 999); // เวลา 23:59:59:999

      const repairRecords = await prisma.repairRecord.findMany({
        where: {
          payDate: {
            gte: startDate,
            lte: endDate,
          },
          status: "complete",
        },
      });

      return repairRecords;
    } catch (error) {
      return error;
    }
  },
  dashboard: async ({ query }: any) => {
    try {
        // get year and month from query string
        const year = parseInt(query.year);
        const month = parseInt(query.month);

        const totalRepairRecord = await prisma.repairRecord.count();
        const totalRepairRecordComplete = await prisma.repairRecord.count({
            where: {
                status: "complete"
            }
        });
        const totalRepairRecordNotComplete = await prisma.repairRecord.count({
            where: {
                status: {
                    not: "complete"
                }
            }
        });
        const totalAmount = await prisma.repairRecord.aggregate({
            _sum: {
                amount: true
            },
            where: {
                status: "complete"
            }
        });

        //
        // list for income per days
        //
        const listIncomePerDays = [];
        const totalDaysInMonthAndYear = new Date(year, month, 0).getDate();

        for (let i = 1; i <= totalDaysInMonthAndYear; i++) {
            let startDate = new Date(year + '-' + month + '-' + i);
            startDate.setHours(0, 0, 0, 0);

            let endDate = new Date(year + '-' + month + '-' + i);
            endDate.setHours(23, 59, 59, 999);

            const totalIncome = await prisma.repairRecord.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: "complete"
                }
            });

            listIncomePerDays.push({
                date: i,
                amount: totalIncome._sum.amount ?? 0
            });
        }

        return {
            totalRepairRecord: totalRepairRecord,
            totalRepairRecordComplete: totalRepairRecordComplete,
            totalRepairRecordNotComplete: totalRepairRecordNotComplete,
            totalAmount: totalAmount._sum.amount,
            listIncomePerDays: listIncomePerDays
        };
    } catch (error) {
        return error;
    }
},
// 
// รายได้ รายเดือน
//
incomePerMonth: async ({ query }: {
    query: {
        year: string;
    }
}) => {
    try {
        const year = parseInt(query.year);
        let listIncomePerMonth = [];

        for (let i = 1; i <= 12; i++) {
            const totalDaysInMonth = dayjs(year + '-' + i + '-01').daysInMonth();
            let startDate = new Date(year + '-' + i + '-01');
            startDate.setHours(0, 0, 0, 0);

            let endDate = new Date(year + '-' + i + '-' + totalDaysInMonth);
            endDate.setHours(23, 59, 59, 999);

            const totalIncome = await prisma.repairRecord.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: "complete"
                }
            });

            listIncomePerMonth.push({
                month: i,
                amount: totalIncome._sum.amount ?? 0
            });
        }

        return listIncomePerMonth;
    } catch (error) {
        return error;
    }
}
}