import React from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import DashboardHeader from "../../components/customer/DashboardHeader";

/*
  TODO: Replace this demo object with your repair API.

  The page is intentionally driven by the repair ID in the URL:
  /dashboard/customer/repairs/:repairId

  Recommended backend response:
  {
    id,
    product,
    serial,
    issueType,
    issue,
    description,
    status,
    requestDate,
    estimatedCost,
    diagnosis,
    technician,
    serviceCenter,
    warranty,
    timeline: [...]
  }
*/

const REPAIRS_BY_ID = {
  "RPR-2026-0041": {
    id: "RPR-2026-0041",
    displayOrder: "#4471",
    product: "Aurea A14 Laptop",
    category: "Laptop",
    serial: "8842-AX10-7731",
    issueType: "Battery / charging",
    issue: "Battery not charging",
    description:
      "Battery not charging and laptop shuts down randomly when unplugged.",
    requestDate: "12 Aug 2026",
    requestTime: "9:14 AM",
    status: "in-progress",
    statusLabel: "In progress",
    serviceCenter: "Center 3 — Dhanmondi",
    warranty: "Covered",
    estimatedCost: "৳1,850",
    technician: {
      initials: "FK",
      name: "Farhan Kabir",
      role: "Hardware specialist",
      experience: "6 yrs experience",
    },
    timeline: [
      {
        title: "Request submitted",
        date: "12 Aug 2026",
        time: "9:14 AM",
        description:
          "Issue logged: battery not charging, shuts down randomly when unplugged.",
        state: "complete",
      },
      {
        title: "Technician assigned",
        date: "12 Aug 2026",
        time: "2:40 PM",
        description:
          "Assigned to Farhan Kabir at Service Center 3 — Dhanmondi.",
        state: "complete",
      },
      {
        title: "Diagnosis in progress",
        date: "13 Aug 2026",
        time: "11:05 AM",
        description:
          "Battery health test running. Estimated diagnosis complete by end of day.",
        state: "current",
      },
      {
        title: "Repair & parts replacement",
        date: null,
        time: "Pending diagnosis",
        description:
          "Any spare parts used will be logged against this repair order.",
        state: "upcoming",
      },
      {
        title: "Ready for pickup",
        date: null,
        time: "Pending repair",
        description:
          "Invoice will be generated and you'll be notified.",
        state: "upcoming",
      },
    ],
  },

  "RPR-2026-0022": {
    id: "RPR-2026-0022",
    displayOrder: "#4458",
    product: "PixelPoint Tablet",
    category: "Tablet",
    serial: "5567-PX2-1190",
    issueType: "Power / startup",
    issue: "Won't power on",
    description:
      "Device does not respond when the power button is pressed.",
    requestDate: "29 Jun 2026",
    requestTime: "10:25 AM",
    status: "awaiting-parts",
    statusLabel: "Awaiting parts",
    serviceCenter: "Center 3 — Dhanmondi",
    warranty: "Expired",
    estimatedCost: "৳3,200",
    technician: {
      initials: "RM",
      name: "Rafiq Mahmud",
      role: "Device technician",
      experience: "4 yrs experience",
    },
    timeline: [
      {
        title: "Request submitted",
        date: "29 Jun 2026",
        time: "10:25 AM",
        description:
          "Issue logged: device does not respond when the power button is pressed.",
        state: "complete",
      },
      {
        title: "Technician assigned",
        date: "29 Jun 2026",
        time: "1:15 PM",
        description:
          "Assigned to Rafiq Mahmud at Service Center 3 — Dhanmondi.",
        state: "complete",
      },
      {
        title: "Diagnosis completed",
        date: "30 Jun 2026",
        time: "3:40 PM",
        description:
          "Fault identified and replacement component requested from supplier.",
        state: "complete",
      },
      {
        title: "Repair & parts replacement",
        date: "Pending",
        time: "Awaiting parts",
        description:
          "Replacement component has been requested. You will be notified when it arrives.",
        state: "current",
      },
      {
        title: "Ready for pickup",
        date: null,
        time: "Pending repair",
        description:
          "Invoice will be generated and you'll be notified.",
        state: "upcoming",
      },
    ],
  },

  "RPR-2026-0038": {
    id: "RPR-2026-0038",
    displayOrder: "#4482",
    product: "PixelPoint Tablet",
    category: "Tablet",
    serial: "5567-PX2-1190",
    issueType: "Screen / display",
    issue: "Screen flickers on startup",
    description:
      "Display flickers for several seconds after powering on.",
    requestDate: "15 Aug 2026",
    requestTime: "8:35 AM",
    status: "pending",
    statusLabel: "Pending",
    serviceCenter: "Center 3 — Dhanmondi",
    warranty: "Expired",
    estimatedCost: null,
    technician: null,
    timeline: [
      {
        title: "Request submitted",
        date: "15 Aug 2026",
        time: "8:35 AM",
        description:
          "Issue logged: screen flickers on startup.",
        state: "current",
      },
      {
        title: "Technician assigned",
        date: null,
        time: "Pending assignment",
        description:
          "A technician will be assigned after the service center reviews the request.",
        state: "upcoming",
      },
      {
        title: "Diagnosis",
        date: null,
        time: "Pending technician",
        description:
          "The technician will record the diagnosis here.",
        state: "upcoming",
      },
      {
        title: "Repair & parts replacement",
        date: null,
        time: "Pending diagnosis",
        description:
          "Any spare parts used will be logged against this repair order.",
        state: "upcoming",
      },
      {
        title: "Ready for pickup",
        date: null,
        time: "Pending repair",
        description:
          "Invoice will be generated and you'll be notified.",
        state: "upcoming",
      },
    ],
  },
};

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.23a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 21 16Z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2Z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h8" />
      <path d="M9 17h6" />
    </svg>
  );
}

function TimelineMarker({ state }) {
  if (state === "complete") {
    return (
      <div className="
        relative z-10
        flex h-6 w-6 shrink-0
        items-center justify-center
        rounded-full
        border-2 border-neutral-900
        bg-neutral-900
        text-white
      ">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>
    );
  }

  if (state === "current") {
    return (
      <div className="
        relative z-10
        flex h-6 w-6 shrink-0
        items-center justify-center
        rounded-full
        border-2 border-neutral-900
        bg-amber-200
      ">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-900" />
      </div>
    );
  }

  return (
    <div className="
      relative z-10
      h-6 w-6 shrink-0
      rounded-full
      border-2 border-neutral-900
      bg-white
    " />
  );
}

function TimelineItem({ item, isLast }) {
  return (
    <div className="relative flex gap-4 sm:gap-5">

      {!isLast && (
        <span className="
          absolute
          left-[11px]
          top-6
          bottom-[-28px]
          w-px
          bg-neutral-300
        " />
      )}

      <TimelineMarker state={item.state} />

      <div className="
        min-w-0 flex-1
        pb-7
        -mt-1
      ">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
          <h3
            className={`
              text-sm sm:text-base font-bold
              ${item.state === "current" ? "text-neutral-900" : "text-neutral-700"}
            `}
          >
            {item.title}
          </h3>

          {item.state === "current" && (
            <Badge variant="warn" className="self-start sm:self-auto">
              Current
            </Badge>
          )}
        </div>

        <p className="mt-1 font-mono text-[11px] sm:text-xs text-neutral-500">
          {item.date ? `${item.date}, ` : ""}
          {item.time}
        </p>

        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function RepairTrackingPage() {
  const { repairId } = useParams();

  // TODO: replace this with a real authenticated user.
  const user = {
    firstName: "Ayan",
    lastName: "Rahman",
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  const repair =
    REPAIRS_BY_ID[repairId] ||
    REPAIRS_BY_ID["RPR-2026-0041"];

  const hasTechnician = Boolean(repair.technician);
  const hasCost = Boolean(repair.estimatedCost);

  return (
    <div className="min-h-screen bg-[#F6F4EC] text-neutral-900">
      <DashboardHeader user={user} initials={initials} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

        {/* Breadcrumb */}
        <div className="
          flex flex-wrap items-center
          gap-x-2 gap-y-1
          text-sm
          mb-5
        ">
          <Link
            to="/dashboard/customer/repairs"
            className="
              font-semibold
              hover:text-amber-600
              transition-colors duration-150
            "
          >
            Repairs
          </Link>

          <span className="text-neutral-400">/</span>

          <span className="font-mono text-neutral-500">
            Request {repair.displayOrder}
          </span>
        </div>

        {/* Page heading */}
        <div className="
          flex flex-col
          lg:flex-row
          lg:items-end
          lg:justify-between
          gap-5
          mb-8
        ">
          <div className="min-w-0">
            <p className="
              font-mono
              text-[11px] sm:text-xs
              uppercase
              tracking-[0.14em]
              text-neutral-500
              mb-2
            ">
              {repair.product.toUpperCase()} · FILED {repair.requestDate.toUpperCase()}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="
                text-2xl sm:text-3xl lg:text-4xl
                font-bold
                tracking-tight
              ">
                {repair.issue}
              </h1>

              <Badge variant="warn">
                {repair.statusLabel}
              </Badge>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // TODO: connect this to your service-center phone/chat/contact API.
              window.alert(
                `Contact ${repair.serviceCenter} about repair ${repair.id}.`
              );
            }}
            className="
              inline-flex
              w-full sm:w-auto
              items-center
              justify-center
              gap-2
              rounded-full
              border-2 border-neutral-900
              bg-white
              px-5 py-2.5
              text-sm
              font-semibold
              transition-all duration-150 ease-out
              hover:bg-amber-50
              hover:-translate-y-0.5
              hover:shadow-[3px_3px_0_0_#111827]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-neutral-900
            "
          >
            <PhoneIcon />
            Contact service center
          </button>
        </div>

        {/* Main responsive layout */}
        <div className="
          grid
          grid-cols-1
          lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.95fr)]
          gap-5
          items-start
        ">

          {/* Timeline */}
          <Card className="
            min-w-0
            shadow-[5px_5px_0_0_#E3DFD0]
            hover:shadow-[7px_7px_0_0_#E3DFD0]
            transition-shadow duration-200
          ">
            <div className="flex items-center justify-between gap-3 mb-7">
              <div>
                <h2 className="text-base sm:text-lg font-bold">
                  Repair timeline
                </h2>

                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Follow each stage of your repair request.
                </p>
              </div>

              <span className="
                hidden sm:inline-flex
                rounded-full
                border
                border-neutral-300
                px-3 py-1
                font-mono
                text-[10px]
                uppercase
                tracking-wide
                text-neutral-500
              ">
                {repair.id}
              </span>
            </div>

            <div>
              {repair.timeline.map((item, index) => (
                <TimelineItem
                  key={`${item.title}-${index}`}
                  item={item}
                  isLast={index === repair.timeline.length - 1}
                />
              ))}
            </div>
          </Card>

          {/* Right rail */}
          <div className="space-y-5">

            {/* Technician */}
            <Card className="
              hover:-translate-y-1
              hover:shadow-[6px_6px_0_0_#111827]
              transition-all duration-200
            ">
              <p className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-neutral-500
                mb-4
              ">
                Assigned technician
              </p>

              {hasTechnician ? (
                <div className="flex items-center gap-3 mb-4">
                  <div className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-md
                    border-2 border-neutral-900
                    bg-emerald-200
                    text-xs
                    font-bold
                  ">
                    {repair.technician.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base">
                      {repair.technician.name}
                    </p>

                    <p className="text-xs text-neutral-500">
                      {repair.technician.role} ·{" "}
                      {repair.technician.experience}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="
                  rounded-md
                  border
                  border-dashed border-neutral-300
                  bg-[#F6F4EC]
                  p-3
                  text-sm
                  text-neutral-500
                  mb-4
                ">
                  A technician has not been assigned yet. We'll update this
                  section when your request is accepted.
                </div>
              )}

              <div className="border-t border-neutral-200">
                <div className="
                  flex items-center justify-between
                  gap-4
                  py-2.5
                  border-b border-neutral-200
                  text-sm
                ">
                  <span className="text-neutral-600">
                    Service center
                  </span>

                  <span className="font-medium text-right">
                    {repair.serviceCenter}
                  </span>
                </div>

                <div className="
                  flex items-center justify-between
                  gap-4
                  py-2.5
                  text-sm
                ">
                  <span className="text-neutral-600">
                    Repair order
                  </span>

                  <span className="font-mono font-medium">
                    {repair.displayOrder}
                  </span>
                </div>
              </div>
            </Card>

            {/* Estimated cost */}
            <div className="
              rounded-md
              border-2 border-neutral-900
              bg-neutral-900
              text-white
              p-5
              transition-all duration-200
              hover:-translate-y-1
              hover:shadow-[6px_6px_0_0_#111827]
            ">
              <p className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-amber-300
              ">
                Estimated cost
              </p>

              {hasCost ? (
                <>
                  <p className="
                    text-2xl sm:text-3xl
                    font-bold
                    mt-2
                  ">
                    {repair.estimatedCost}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      // TODO: navigate to your invoice/payment page once available.
                      window.alert(
                        `Invoice for repair ${repair.id} will open here.`
                      );
                    }}
                    className="
                      mt-5
                      w-full
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border-2 border-neutral-900
                      bg-amber-200
                      text-neutral-900
                      px-4 py-2.5
                      text-sm
                      font-semibold
                      transition-all duration-150
                      hover:bg-amber-300
                      hover:-translate-y-0.5
                    "
                  >
                    <ReceiptIcon />
                    View invoice
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold mt-2">
                    Pending assessment
                  </p>

                  <p className="text-xs text-neutral-300 mt-2 leading-5">
                    The estimated repair cost will appear after the technician
                    completes the diagnosis.
                  </p>
                </>
              )}
            </div>

            {/* Product under repair */}
            <Card className="
              hover:-translate-y-1
              hover:shadow-[6px_6px_0_0_#111827]
              transition-all duration-200
            ">
              <p className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-neutral-500
                mb-4
              ">
                Product under repair
              </p>

              <div className="border-t border-neutral-200">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  py-2.5
                  border-b border-neutral-200
                  text-sm
                ">
                  <span className="text-neutral-600">
                    Product
                  </span>

                  <span className="font-medium text-right">
                    {repair.product}
                  </span>
                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  py-2.5
                  border-b border-neutral-200
                  text-sm
                ">
                  <span className="text-neutral-600">
                    Serial
                  </span>

                  <span className="font-mono text-xs sm:text-sm text-right">
                    {repair.serial}
                  </span>
                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  py-2.5
                  text-sm
                ">
                  <span className="text-neutral-600">
                    Warranty
                  </span>

                  <span className="
                    font-medium
                    flex items-center gap-1.5
                  ">
                    <span
                      className={`
                        inline-block h-2 w-2 rounded-full
                        ${repair.warranty === "Covered"
                          ? "bg-emerald-500"
                          : "bg-neutral-400"}
                      `}
                    />
                    {repair.warranty}
                  </span>
                </div>
              </div>

              <div className="
                mt-4
                rounded-md
                border
                border-neutral-200
                bg-[#F6F4EC]
                p-3
              ">
                <div className="flex items-start gap-2">
                  <ProductIcon />

                  <div>
                    <p className="text-xs font-semibold">
                      Issue type
                    </p>

                    <p className="text-xs text-neutral-500 mt-0.5">
                      {repair.issueType}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="
          flex
          flex-col-reverse
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
          mt-6
        ">
          <Link
            to="/dashboard/customer/repairs"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-md
              border-2 border-neutral-900
              bg-white
              px-4 py-2.5
              text-sm
              font-semibold
              transition-all duration-150
              hover:bg-amber-50
              hover:-translate-y-0.5
              hover:shadow-[3px_3px_0_0_#111827]
            "
          >
            <ArrowLeftIcon />
            Back to my repairs
          </Link>

          <p className="
            text-center sm:text-right
            text-xs
            text-neutral-500
          ">
            Repair updates are added to your timeline as the service center
            progresses the repair.
          </p>
        </div>
      </main>
    </div>
  );
}
