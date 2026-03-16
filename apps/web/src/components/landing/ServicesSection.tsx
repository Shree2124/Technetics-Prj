import { FileText, ShieldCheck, Users, Activity, Landmark, Bell } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      title: "Welfare Schemes",
      description: "Discover and apply for national and state-level welfare programs tailored to your eligibility.",
      icon: <Landmark className="h-6 w-6 text-gov-mid-blue" />,
    },
    {
      title: "Identity Verification",
      description: "Securely link and verify your citizen identity documents for faster application processing.",
      icon: <ShieldCheck className="h-6 w-6 text-gov-mid-blue" />,
    },
    {
      title: "Application Tracking",
      description: "Monitor the real-time status of your submitted applications and benefit disbursements.",
      icon: <Activity className="h-6 w-6 text-gov-mid-blue" />,
    },
    {
      title: "Document Vault",
      description: "Store essential certificates and records safely in your personal digital document vault.",
      icon: <FileText className="h-6 w-6 text-gov-mid-blue" />,
    },
    {
      title: "Family Management",
      description: "Link family members to manage collective household benefits and schemes.",
      icon: <Users className="h-6 w-6 text-gov-mid-blue" />,
    },
    {
      title: "Grievance Redressal",
      description: "Submit and track complaints regarding scheme applications or benefit deliveries.",
      icon: <Bell className="h-6 w-6 text-gov-mid-blue" />,
    },
  ];

  return (
    <section id="services" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gov-dark-blue sm:text-4xl">
            Citizen Services
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded bg-gov-mid-blue"></div>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gov-slate">
            Access essential government services through a single unified digital portal.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-start rounded-xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-gray-200/50 transition-all hover:shadow-md hover:ring-gov-light-blue"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gov-light-gray transition-colors group-hover:bg-gov-light-blue/20">
                {service.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gov-dark-blue">
                {service.title}
              </h3>
              <p className="text-sm text-gov-slate leading-relaxed">
                {service.description}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center text-sm font-medium text-gov-mid-blue hover:text-gov-dark-blue"
              >
                Learn more <span aria-hidden="true" className="ml-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
