"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CompareSpecialty = {
  id: string;
  slug: string;
  name: string;
  category: string;
  overview: string;
  residency: string;
  pros: string[];
  cons: string[];
  attributeScores?: Record<string, number>;
};

const attributes = [
  ["lifestyle", "Work-life balance"],
  ["stress", "Stress"],
  ["procedures", "Procedural work"],
  ["patientContact", "Patient contact"],
  ["intellectual", "Intellectual depth"],
  ["income", "Income potential"],
] as const;

function score(specialty: CompareSpecialty, attribute: string) {
  return specialty.attributeScores?.[attribute] ?? 3;
}

export default function CompareClient({
  specialties,
}: {
  specialties: CompareSpecialty[];
}) {
  const [leftId, setLeftId] = useState(specialties[0]?.id ?? "");
  const [rightId, setRightId] = useState(specialties[1]?.id ?? specialties[0]?.id ?? "");
  const left = useMemo(
    () => specialties.find((specialty) => specialty.id === leftId),
    [leftId, specialties],
  );
  const right = useMemo(
    () => specialties.find((specialty) => specialty.id === rightId),
    [rightId, specialties],
  );

  if (!left || !right) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-muted">Add at least two active specialties to compare them.</p>
        <Link href="/admin/specialties" className="ui-button ui-button-primary mt-5">
          Open specialty editor
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["First specialty", leftId, setLeftId],
          ["Second specialty", rightId, setRightId],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="block space-y-2">
            <span className="text-sm font-medium">{label as string}</span>
            <select
              value={value as string}
              onChange={(event) => (setter as (id: string) => void)(event.target.value)}
              className="ui-select w-full"
            >
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[left, right].map((specialty) => (
          <section key={specialty.id} className="ui-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {specialty.category}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{specialty.name}</h2>
              </div>
              <Link href={`/specialties/${specialty.slug}`} className="text-sm text-accent hover:underline">
                View profile
              </Link>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{specialty.overview}</p>
          </section>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-border/40 bg-white/40">
        <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-border/40 bg-muted/20 px-4 py-3 text-sm font-medium">
          <span>Dimension</span>
          <span className="text-center">{left.name}</span>
          <span className="text-center">{right.name}</span>
        </div>
        {attributes.map(([id, label]) => {
          const leftScore = score(left, id);
          const rightScore = score(right, id);
          return (
            <div key={id} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-3 border-b border-border/20 px-4 py-4 last:border-b-0">
              <span className="text-sm text-muted">{label}</span>
              {[leftScore, rightScore].map((value, index) => (
                <div key={`${id}-${index}`} className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/20">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${value * 20}%` }} />
                  </div>
                  <span className="w-5 text-right text-sm font-semibold">{value}</span>
                </div>
              ))}
            </div>
          );
        })}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {[left, right].map((specialty) => (
          <section key={`${specialty.id}-details`} className="ui-card p-5">
            <h2 className="text-lg font-semibold">Training and trade-offs</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{specialty.residency}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-emerald-700">Strengths</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {specialty.pros.slice(0, 3).map((item) => <li key={item}>+ {item}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-700">Trade-offs</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {specialty.cons.slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
