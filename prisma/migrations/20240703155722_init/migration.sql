-- CreateTable
CREATE TABLE "dokinhlac" (
    "dokinhlac_id" SERIAL NOT NULL,
    "symptom" TEXT,
    "patient_id" INTEGER,
    "tieutruong_trai" INTEGER,
    "tam_trai" INTEGER,
    "tamtieu_trai" INTEGER,
    "tambao_trai" INTEGER,
    "daitruong_trai" INTEGER,
    "phe_trai" INTEGER,
    "tieutruong_phai" INTEGER,
    "tam_phai" INTEGER,
    "tamtieu_phai" INTEGER,
    "tambao_phai" INTEGER,
    "daitruong_phai" INTEGER,
    "phe_phai" INTEGER,
    "bangquang_trai" INTEGER,
    "than_trai" INTEGER,
    "dom_trai" INTEGER,
    "vi_trai" INTEGER,
    "can_trai" INTEGER,
    "ty_trai" INTEGER,
    "bangquang_phai" INTEGER,
    "than_phai" INTEGER,
    "dom_phai" INTEGER,
    "vi_phai" INTEGER,
    "can_phai" INTEGER,
    "ty_phai" INTEGER,

    CONSTRAINT "dokinhlac_pkey" PRIMARY KEY ("dokinhlac_id")
);

-- CreateTable
CREATE TABLE "patient" (
    "patient_id" SERIAL NOT NULL,
    "patient_name" VARCHAR(255),
    "patient_phone" VARCHAR(50),
    "patient_year" INTEGER,
    "patient_sex" TEXT,
    "patient_history" TEXT,
    "user_email" VARCHAR(255),

    CONSTRAINT "patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_email" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255),
    "user_phone" VARCHAR(50),

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_email")
);

-- AddForeignKey
ALTER TABLE "dokinhlac" ADD CONSTRAINT "dokinhlac_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "fk_user_email" FOREIGN KEY ("user_email") REFERENCES "user"("user_email") ON DELETE NO ACTION ON UPDATE NO ACTION;
