-- CreateTable
CREATE TABLE "IdOTP" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "IdOTP_id_key" ON "IdOTP"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IdOTP_otp_key" ON "IdOTP"("otp");

-- CreateIndex
CREATE UNIQUE INDEX "IdOTP_id_otp_key" ON "IdOTP"("id", "otp");
