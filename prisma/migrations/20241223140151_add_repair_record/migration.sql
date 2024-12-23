-- CreateTable
CREATE TABLE "RepairRecord" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceBarcode" TEXT NOT NULL,
    "deviceSerial" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solving" TEXT NOT NULL,
    "deviceId" INTEGER,
    "userId" INTEGER,
    "engineerId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endJobDate" TIMESTAMP(3),
    "payDate" TIMESTAMP(3),
    "amount" INTEGER,
    "imageBeforeRepair" TEXT,
    "imageAfterRepair" TEXT,

    CONSTRAINT "RepairRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RepairRecord" ADD CONSTRAINT "RepairRecord_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairRecord" ADD CONSTRAINT "RepairRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
