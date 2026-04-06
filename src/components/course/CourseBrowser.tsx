"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionWithProfessor } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProfessorRating } from "./ProfessorRating";
import { formatTimeRange, formatDays } from "@/lib/utils/formatTime";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  Loader2,
  BookOpen,
} from "lucide-react";

interface CourseFromAPI {
  id: string;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  department: string;
  fulfills: string[];
  sections: SectionWithProfessor[];
}

interface Department {
  name: string;
  code: string;
}

interface CourseBrowserProps {
  addedIds: Set<string>;
  onAdd: (section: SectionWithProfessor) => void;
}

export function CourseBrowser({ addedIds, onAdd }: CourseBrowserProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<CourseFromAPI[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(true);

  // Fetch departments on mount
  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch(() => {})
      .finally(() => setDeptLoading(false));
  }, []);

  // Fetch courses when dept or search changes
  const fetchCourses = useCallback(async () => {
    if (!selectedDept && !searchQuery) {
      setCourses([]);
      return;
    }
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDept) params.set("department", selectedDept);
      if (searchQuery) params.set("q", searchQuery);
      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) setCourses(data);
    } catch {
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDept, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-primary">Browse Courses</h2>
      </div>

      {/* Department filter */}
      <div className="px-4 py-3 space-y-2 border-b border-border">
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setExpandedCourse(null);
          }}
          className="w-full text-sm bg-surface border border-border rounded-lg px-3 py-2 text-primary focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Select department...</option>
          {deptLoading ? (
            <option disabled>Loading...</option>
          ) : (
            departments.map((d) => (
              <option key={d.name} value={d.name}>
                {d.code} — {d.name}
              </option>
            ))
          )}
        </select>

        {/* Text search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or code..."
            className="w-full text-sm bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-primary placeholder:text-tertiary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto">
        {!selectedDept && !searchQuery && (
          <div className="text-center py-12 px-4">
            <BookOpen className="w-10 h-10 text-tertiary mx-auto mb-3" />
            <p className="text-secondary text-sm">Select a department to browse courses</p>
            <p className="text-tertiary text-xs mt-1">
              Or search by course name or code
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-secondary" />
          </div>
        )}

        {!isLoading && (selectedDept || searchQuery) && courses.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-secondary text-sm">No courses found</p>
          </div>
        )}

        {!isLoading && courses.map((course) => (
          <div key={course.id} className="border-b border-border/50">
            {/* Course row */}
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-surface transition-colors duration-150"
            >
              {expandedCourse === course.id ? (
                <ChevronDown className="w-3.5 h-3.5 text-tertiary shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-tertiary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary">
                    {course.code}
                  </span>
                  <Badge className="shrink-0">{course.credits} cr</Badge>
                </div>
                <p className="text-xs text-secondary truncate mt-0.5">
                  {course.title}
                </p>
              </div>
              <span className="text-[10px] text-tertiary shrink-0">
                {course.sections.length} sec
              </span>
            </button>

            {/* Expanded sections */}
            {expandedCourse === course.id && (
              <div className="bg-surface/50 px-4 pb-3 space-y-2 animate-slide-up">
                {course.description && (
                  <p className="text-xs text-tertiary px-5 pb-1">
                    {course.description}
                  </p>
                )}
                {course.fulfills.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-5 pb-1">
                    {course.fulfills.map((f) => (
                      <Badge key={f} variant="default">
                        {f}
                      </Badge>
                    ))}
                  </div>
                )}
                {course.sections.map((section) => {
                  const seatVariant =
                    section.openSeats > 5
                      ? "success"
                      : section.openSeats > 0
                      ? "warning"
                      : "danger";
                  const isAdded = addedIds.has(section.id);

                  return (
                    <div
                      key={section.id}
                      className="border border-border rounded-lg p-2.5 mx-2 space-y-1.5 hover:border-border-hover transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">
                          Section {section.sectionNumber}
                          {section.type !== "Lecture" && (
                            <span className="text-tertiary ml-1">
                              ({section.type})
                            </span>
                          )}
                        </span>
                        <Badge variant={seatVariant}>
                          {section.openSeats}/{section.totalSeats}
                        </Badge>
                      </div>

                      {section.professor && (
                        <ProfessorRating
                          rating={section.professor.rmpRating}
                          name={section.professor.name}
                          compact
                        />
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-secondary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDays(section.days)}{" "}
                          {formatTimeRange(section.startTime, section.endTime)}
                        </span>
                        {section.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {section.location}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end pt-0.5">
                        {isAdded ? (
                          <span className="flex items-center gap-1 text-xs text-tertiary">
                            <Check className="w-3.5 h-3.5" />
                            Added
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdd({
                                ...section,
                                course: {
                                  id: course.id,
                                  code: course.code,
                                  title: course.title,
                                  credits: course.credits,
                                  department: course.department,
                                  fulfills: course.fulfills,
                                },
                              });
                            }}
                          >
                            Add to schedule
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
