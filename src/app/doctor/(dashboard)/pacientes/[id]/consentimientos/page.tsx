import { PatientSectionPage } from "@/components/doctor/PatientSectionPage";

export default async function ConsentimientosPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PatientSectionPage
      patientId={id}
      title="Consentimientos"
      eyebrow="Autorizaciones"
      icon="fact_check"
      items={[
        "Consentimiento de datos personales",
        "Consentimiento para tratamiento y procedimiento",
        "WhatsApp, marketing y uso de imagen por separado",
        "Vigencia, estado y evidencia auditada",
      ]}
    />
  );
}
